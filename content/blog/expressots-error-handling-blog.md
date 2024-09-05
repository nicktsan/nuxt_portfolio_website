---
title: "Handling custom error responses from ExpressoTS with TanStack Query, and NextJS"
description: "Learn how to handle custom error responses in web applications using ExpressoTS, TanStack Query, and Next.js. This guide walks you through building error management that improves user experience."
date: 2024-09-04
cover: error-handling-title.jpg
# tags:
#   - blog
---

**Table of contents:**

- [Introduction](#intro)
- [Back End](#backend)
- [DeckView Page Part 1](#deckview-one)
- [DeckView Page Part 2](#deckview-two)
- [DeckView Page Part 3](#deckview-three)
- [Conclusion](#conclusion)

<a id="intro"></a>

## Introduction

Building robust web applications often means handling errors in ways that keep users informed without breaking their experience. In this blog, I'll walk you through how I’ve integrated custom error handling in CookieDeck using [ExpressoTS](https://expresso-ts.com/), [TanStack Query](https://tanstack.com/query/latest) (formerly known as React Query), and Next.js. In this example, we will look at how I leverage custom error responses from ExpressoTS and TanStack Query to load a page based on what type of response I get.

<a id="backend"></a>

## Back End

Let's start by looking at the business logic in the back end:

```ts
// \src\deck\update\incrementview\deck-update-incrementview.usecase.ts
import { provide } from "inversify-binding-decorators";
import { DeckRepository } from "../../deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";
import {
  IDeckUpdateIncrementviewRequestDto,
  IDeckUpdateIncrementviewResponseDto,
} from "./deck-update-incrementview.dto";
import { DeckEntity } from "../../deck.entity";
import { ISimpleDeckFindResponseDto } from "../../find/deck-find.dto";

@provide(DeckUpdateIncrementviewUsecase)
export class DeckUpdateIncrementviewUsecase {
  constructor(private deckRepository: DeckRepository, private report: Report) {}
  public async execute(
    payload: IDeckUpdateIncrementviewRequestDto,
    userId: string
  ): Promise<IDeckUpdateIncrementviewResponseDto | AppError> {
    const doesDeckExist: ISimpleDeckFindResponseDto | null =
      await this.deckRepository.simpleFindById(payload.id);
    if (!doesDeckExist) {
      throw this.report.error(
        `Deck ${payload.id} not found`,
        StatusCode.NotFound,
        `DeckUpdateIncrementviewUsecase`
      );
    }
    if (
      doesDeckExist.creator_id !== userId &&
      doesDeckExist.visibility.toLowerCase() === "private"
    ) {
      throw this.report.error(
        `User is not authorized to access deck ${payload.id}`,
        StatusCode.BadRequest,
        `DeckUpdateIncrementviewUsecase`
      );
    }

    const res: DeckEntity | null = await this.deckRepository.incrementDeckView(
      payload.id
    );
    if (!res) {
      throw this.report.error(
        "Deck views failed to increment",
        StatusCode.BadRequest,
        `DeckUpdateIncrementviewUsecase`
      );
    }
    return {
      id: res.id,
      message: "Deck updated successfully.",
    };
  }
}
```

The code can be split into two parts. In the first part, the code checks if a deck with the id defined in payload.id exists. If it doesn't exist, throw an error stating it does not exist. If it does exist, if the user id from the request is not equal to the deck's creator id and the deck's visibility is set to "private", the code throws an unauthorized user error. Otherwise, proceed to the second part, where the code calls the "incrementDeckView" function to increment the deck's view count by +1. If the response is falsy, throw an error. Otherwise, return a success response to the client.

You may have noticed the code imports "Report". This is ExpressoTS' standardized error reporting class to ensure formatting consistency in error messages that are returned to clients. In order to use it, it must be passed into the constructor of the usecase.

The error responses and logs generated from the aforementioned usecase are as follows.

```ts
{
    "statusCode": 400,
    "error": "User is not authorized to access deck 69e2badc-a350-4107-88ef-4979716ce2ec"
}
```

```ts
{
    "statusCode": 404,
    "error": "Deck 69e2badc-a350-4107-88ef-4979716ce2ed not found"
}
```

```
[ExpressoTS] 2024-09-05 11:25:50 a.m. [PID:5812] ERROR [DeckUpdateIncrementviewUsecase] Deck 69e2badc-a350-4107-88ef-4979716ce2ed not found
[ExpressoTS] 2024-09-05 11:25:56 a.m. [PID:5812] ERROR [DeckUpdateIncrementviewUsecase] User is not authorized to access deck 69e2badc-a350-4107-88ef-4979716ce2ec
```

ExpressoTS has a middleware function called "ValidateDTO" for checking and validating the request from the client. This is what the generated error response looks like when validation fails:

```ts
{
    "errorCode": 400,
    "errorMessage": "Bad Request",
    "DTO": [
        {
            "property": "id",
            "messages": [
                "id must be a UUID"
            ]
        }
    ]
}
```

Now that I've covered the back end, let's see the front end code for incrementing deck views. Here is the deck viewing page in its entirety:

```tsx
// app\(primary)\deck\[id]\page.tsx
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeckFindResponseDataDTO } from "@/services/deck/find/findDeckDTO";
import DeckInfo from "@/components/deckpage/DeckInfo";
import CardSearch from "@/components/deckpage/CardSearch";
import DeckSlotDisplay from "@/components/deckpage/DeckSlotDisplay";
import { DeckslotFindResponseDTO } from "@/services/deckslot/find/deckslot-find.dto";
import { FindDeck } from "@/services/deck/find/findDeck";
import { DeckSlotFindByDeckId } from "@/services/deckslot/find/bydeckId/deckslot-find-bydeckid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DeckPageFooter from "@/components/deckpage/DeckPageFooter";
import { DeckPageDropDownMenu } from "@/components/deckpage/DeckPageDropDownMenu";
import { IncrementDeckView } from "@/services/deck/update/incrementview/incrementDeckView";
import { createClient } from "@/utils/supabase/client";

export default function DeckView({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [viewMode, setViewMode] = useState<"en" | "kr">("en");
  const queryClient = useQueryClient();

  const { data: userData, isLoading: isUserAuthenticated } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    retry: false, // No retries for PATCH request
    refetchOnWindowFocus: false, // Avoid refetch on window focus
  });

  const {
    data: patchResponse,
    isLoading: isPatchLoading,
    error: incrementViewError,
  } = useQuery({
    queryKey: ["patchDeck", params.id],
    queryFn: () => IncrementDeckView({ id: params.id }),
    retry: false, // No retries for PATCH request
    refetchOnWindowFocus: false, // Avoid refetch on window focus
  });

  const { data: displayDeck, isLoading: isDeckLoading } =
    useQuery<DeckFindResponseDataDTO>({
      queryKey: ["deck", params.id],
      queryFn: () => FindDeck(params.id),
      retry: false,
      refetchOnWindowFocus: false, // Avoid refetch on window focus
      enabled: !!patchResponse, // Only run if PATCH request is successful
    });

  const { data: deckSlots, isLoading: isDeckSlotsLoading } = useQuery<
    DeckslotFindResponseDTO[]
  >({
    queryKey: ["deckSlots", params.id],
    queryFn: async () => {
      const response = await DeckSlotFindByDeckId(params.id);
      return response.deckslots || [];
    },
    retry: false,
    refetchOnWindowFocus: false, // Avoid refetch on window focus
    enabled: !!patchResponse, // Only run if PATCH request is successful
  });

  const updateDeckMutation = useMutation({
    mutationFn: FindDeck,
    onSuccess: (data) => {
      queryClient.setQueryData(["deck", params.id], data);
    },
  });

  const updateDeckSlotsMutation = useMutation({
    mutationFn: DeckSlotFindByDeckId,
    onSuccess: (data) => {
      queryClient.setQueryData(["deckSlots", params.id], data.deckslots || []);
    },
  });

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "en" ? "kr" : "en"));
  };

  if (
    isPatchLoading ||
    isDeckLoading ||
    isDeckSlotsLoading ||
    isUserAuthenticated
  ) {
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <div className="w-full">
          <div className="py-6 text-center font-bold">Loading deck...</div>
        </div>
      </div>
    );
  }

  if (incrementViewError) {
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-20">
        <div className="w-full">
          <div className="py-6 text-center font-bold">
            {incrementViewError.message}
          </div>
        </div>
      </div>
    );
  }

  const isOwner: boolean | null | undefined =
    userData && userData.id === displayDeck?.creator_id;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow pb-32">
        <DeckInfo
          displayDeck={displayDeck}
          deckslots={deckSlots || []}
          onUpdate={() => updateDeckMutation.mutate(params.id)}
          isOwner={isOwner}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="my-4 flex items-center justify-center space-x-2">
          {isOwner && <DeckPageDropDownMenu deckId={params.id} />}
          <Switch id="view-mode" onCheckedChange={toggleViewMode} />
          <Label htmlFor="view-mode">{viewMode === "en" ? "EN" : "KR"}</Label>
          {isOwner && <CardSearch deckId={params.id} viewMode={viewMode} />}
        </div>
        <DeckSlotDisplay
          deckslots={deckSlots || []}
          onUpdate={() => [
            updateDeckSlotsMutation.mutate(params.id),
            updateDeckMutation.mutate(params.id),
          ]}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isOwner={isOwner}
        />
        <DeckPageFooter deckslots={deckSlots || []} />
      </div>
    </div>
  );
}
```

<a id="deckview-one"></a>

## DeckView Page Part 1

It's a lot to take in, so I'll be splitting the Page into three parts and explaining them separately. For the first (and largest) part, I want to cover the actual view increment code.

```tsx
export default function DeckView({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [viewMode, setViewMode] = useState<"en" | "kr">("en");
  const queryClient = useQueryClient();

  const { data: userData, isLoading: isUserAuthenticated } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    retry: false, // No retries for PATCH request
    refetchOnWindowFocus: false, // Avoid refetch on window focus
  });

  const {
    data: patchResponse,
    isLoading: isPatchLoading,
    error: incrementViewError,
  } = useQuery({
    queryKey: ["patchDeck", params.id],
    queryFn: () => IncrementDeckView({ id: params.id }),
    retry: false, // No retries for PATCH request
    refetchOnWindowFocus: false, // Avoid refetch on window focus
  });
}
```

This page takes in a string called "id" as a parameter. I'm using "useState" to keep track of what the displayed language is. Since this page is a client component, we can use TanStack Query's "useQuery" hook to fetch both the user data and increment the view count of the deck by 1. Before I cover the rest of the page, I want to jump in to the code for IncrementDeckView, as that is the main focus of this blog:

```ts
// services\deck\update\incrementview\incrementDeckView.ts
"use server";
import { MakeApiRequest } from "@/services/baseApiRequest";
import {
  DeckUpdateIncrementviewRequestDTO,
  DeckUpdateIncrementviewResponseDataDTO,
  DeckUpdateIncrementviewResponseDTO,
} from "./deck-update-incrementview.dto";
import {
  DeckUpdateIncrementviewRequestSchema,
  DeckUpdateIncrementviewResponseSchema,
} from "./deck-update-incrementview.schema";
import { ENV } from "@/env";

//can use this as an example for error handling
export async function IncrementDeckView(
  deckUpdateIncrementviewRequestData: DeckUpdateIncrementviewRequestDTO
): Promise<DeckUpdateIncrementviewResponseDataDTO> {
  try {
    const deckUpdateIncrementviewUrl =
      ENV.BACKEND_URL + "/deck/update/incrementview";
    const deckUpdateIncrementviewResponse: DeckUpdateIncrementviewResponseDTO =
      await MakeApiRequest({
        url: deckUpdateIncrementviewUrl,
        method: "PATCH",
        requestSchema: DeckUpdateIncrementviewRequestSchema,
        responseSchema: DeckUpdateIncrementviewResponseSchema,
        data: deckUpdateIncrementviewRequestData,
      });
    return deckUpdateIncrementviewResponse.data as DeckUpdateIncrementviewResponseDataDTO;
  } catch (error) {
    console.log("Error incrementing deck view:");
    throw error;
  }
}
```

I'm defining DTOs (Data Transfer Objects) for request validation before sending it to the back end. In a nutshell, the "MakeApiRequest" function takes in the url to the back end as a string, a method, a request schema, a response schema, and the request data as arguments. It performs schema validation of the input data, sends a request to the back end upon successful validation, validates the response data, and returns it if the response validation is successful.

Here is the code for the request and response schemas. I'm using [zod](https://zod.dev/) to do this on the front end:

```ts
// services\deck\update\incrementview\deck-update-incrementview.schema.ts
import { z } from "zod";

export const DeckUpdateIncrementviewRequestSchema = z.object({
  id: z.string().uuid({
    message: "id must be a valid UUID.",
  }),
});

export const DeckUpdateIncrementviewResponseDataSchema = z.object({
  id: z.string().uuid({
    message: "id must be a valid UUID.",
  }),
  message: z.string().optional(),
});

export const DeckUpdateIncrementviewResponseSchema = z.object({
  statusCode: z
    .number({
      required_error: "statusCode is required",
    })
    .min(100)
    .max(599),
  data: DeckUpdateIncrementviewResponseDataSchema,
});
```

The request schema checks if the input id is a UUID. The data from a successful ExpressoTS response contains a statusCode and data property. In this case, the data will contain an id (which must be a UUID) and an optional message (as a string).

In a separate file, I've converted the schemas into a type to reduce the total number of times I need to type
"z.infer<typeof yourSchema>".

```ts
// services\deck\update\incrementview\deck-update-incrementview.dto.ts
import { z } from "zod";
import {
  DeckUpdateIncrementviewRequestSchema,
  DeckUpdateIncrementviewResponseSchema,
  DeckUpdateIncrementviewResponseDataSchema,
} from "./deck-update-incrementview.schema";

type DeckUpdateIncrementviewRequestDTO = z.infer<
  typeof DeckUpdateIncrementviewRequestSchema
>;
type DeckUpdateIncrementviewResponseDTO = z.infer<
  typeof DeckUpdateIncrementviewResponseSchema
>;
type DeckUpdateIncrementviewResponseDataDTO = z.infer<
  typeof DeckUpdateIncrementviewResponseDataSchema
>;

export type {
  DeckUpdateIncrementviewRequestDTO,
  DeckUpdateIncrementviewResponseDTO,
  DeckUpdateIncrementviewResponseDataDTO,
};
```

Let's now cover the "MakeApiRequest" function in more detail:

```tsx
// services\baseApiRequest.ts
import { z, ZodError } from "zod";
import axios, { AxiosError, Method } from "axios";
import { createClient } from "@/utils/supabase/server";
import { ErrorResponseSchema } from "@/utils/error.schema";
import { ResponseError } from "@/utils/responseError";

async function MakeApiRequest<
  TRequest extends z.ZodType,
  TResponse extends z.ZodType
>({
  url,
  method,
  requestSchema,
  responseSchema,
  data,
}: {
  url: string;
  method: Method;
  requestSchema: TRequest;
  responseSchema: TResponse;
  data: z.infer<TRequest>;
}): Promise<z.infer<TResponse>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Trim whitespace from all string data
  const trimmedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  );
  const validData = requestSchema.parse(trimmedData);

  let apiResponse: z.infer<TResponse> = {
    statusCode: 500,
    data: {
      error: "Default error",
    },
  } as z.infer<TResponse>;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const config = {
      method,
      url,
      headers,
      ...(method === "GET" ? { params: validData } : { data: validData }),
    };
    const res = await axios(config);
    if (res.data) {
      apiResponse = responseSchema.parse({
        statusCode: res.status,
        data: res.data,
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error as AxiosError;
      const errorParse = ErrorResponseSchema.safeParse({
        statusCode: response?.status || 500,
        data: response?.data || { error: error },
      });
      if (errorParse.success) {
        throw new ResponseError({
          name: "RESPONSE_ERROR",
          message:
            errorParse.data.data.error ||
            errorParse.data.data.errorMessage ||
            error.message,
          cause: error,
        });
      }
      throw error as AxiosError;
    }
    if (error instanceof ZodError) {
      throw error as ZodError;
    }
    throw error as Error;
  }
  return apiResponse;
}

export { MakeApiRequest };
```

Before entering the try/catch block, the code gets the current user session data with "supabase.auth.getSession()". Then, for each property of the input data that is a string, the code trims all leading and ending whitespace before validating it with the zod schemas defined in the previous code snippet. Finally, a default response is defined. Within the try block, the code attempts to extract the the access token from the user session and use it as the "Authorization" request header. The code then defines an [Axios](https://axios-http.com/docs/intro) configuration, in which the validated input is added to the request params for "GET" requests. For every other type of request, the inputs are added to the request data. The request is then sent to the back end with the previously defined configuration and the response data is parsed with the previously defined zod response schema. In the catch block, the code checks for different types of errors and throws them. If it is an Axios Error, the code attempts to parse the error with a predefined schema, which I will show below:

```ts
// utils\error.schema.ts
import { z } from "zod";
export const ErrorResponseDataSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  //DTO validation failure from the backend
  errorCode: z.number().min(100).max(599).optional(),
  errorMessage: z.string().optional(),
  DTO: z
    .array(
      z.object({
        property: z.string(),
        messages: z.array(z.string()),
      })
    )
    .optional(),
});

export const ErrorResponseSchema = z.object({
  statusCode: z.number().min(100).max(599),
  data: ErrorResponseDataSchema,
});

export type ErrorResponseDataDTO = z.infer<typeof ErrorResponseDataSchema>;
export type ErrorResponseDTO = z.infer<typeof ErrorResponseSchema>;
```

If the error is successfully parsed, I take the ExpressoTS specific content and put it into a custom error called "ResponseError". Here is the code for "ResponseError":

```ts
// utils\responseError.ts
import { BaseError } from "./baseError";
import { ErrorName } from "./baseError";

export class ResponseError extends BaseError<ErrorName> {}
```

"ResponseError" extends a generic "BaseError" class, which I will show below:

```ts
// utils\baseError.ts
export class BaseError<T extends string> extends Error {
  name: T;
  message: string;
  cause: any;

  constructor({
    name,
    message,
    cause,
  }: {
    name: T;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export type ErrorName = "RESPONSE_ERROR";
```

The "ErrorName" type has only one string value for now, but it can have multiple possible string values if I so desire. For example, I could do something like:

```ts
export type ErrorName = "RESPONSE_ERROR" | "CUSTOM_ERROR_2" | "CUSTOM_ERROR_3";
```

<a id="deckview-two"></a>

## DeckView Page Part 2

Now that I've covered what the code for incrementing deck views, I can continue on to the next part of the "DeckView" Page.

```tsx
// app\(primary)\deck\[id]\page.tsx
const { data: displayDeck, isLoading: isDeckLoading } =
  useQuery<DeckFindResponseDataDTO>({
    queryKey: ["deck", params.id],
    queryFn: () => FindDeck(params.id),
    retry: false,
    refetchOnWindowFocus: false, // Avoid refetch on window focus
    enabled: !!patchResponse, // Only run if PATCH request is successful
  });

const { data: deckSlots, isLoading: isDeckSlotsLoading } = useQuery<
  DeckslotFindResponseDTO[]
>({
  queryKey: ["deckSlots", params.id],
  queryFn: async () => {
    const response = await DeckSlotFindByDeckId(params.id);
    return response.deckslots || [];
  },
  retry: false,
  refetchOnWindowFocus: false, // Avoid refetch on window focus
  enabled: !!patchResponse, // Only run if PATCH request is successful
});

const updateDeckMutation = useMutation({
  mutationFn: FindDeck,
  onSuccess: (data) => {
    queryClient.setQueryData(["deck", params.id], data);
  },
});

const updateDeckSlotsMutation = useMutation({
  mutationFn: DeckSlotFindByDeckId,
  onSuccess: (data) => {
    queryClient.setQueryData(["deckSlots", params.id], data.deckslots || []);
  },
});

const toggleViewMode = () => {
  setViewMode((prev) => (prev === "en" ? "kr" : "en"));
};
```

The code for triggering the "FindDeck" and "DeckSlotFindByDeckId" functions is dependent on "IncrementDeckView" being successful. They fetch data for the deck and its deck slots. The "useMutation" hooks in this context are meant to refetch data when data mutation occurs (Ex: the user adds or deletes a card from their deck). As for "toggleViewMode", it toggles the displayed language between Korean and English, based on its current state.

<a id="deckview-three"></a>

## DeckView Page Part 3

The final part of the "DeckView" page leverages loading and error states from the "useQuery" hooks to conditionally render the page.

```tsx
// app\(primary)\deck\[id]\page.tsx
if (
  isPatchLoading ||
  isDeckLoading ||
  isDeckSlotsLoading ||
  isUserAuthenticated
) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <div className="w-full">
        <div className="py-6 text-center font-bold">Loading deck...</div>
      </div>
    </div>
  );
}

if (incrementViewError) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <div className="w-full">
        <div className="py-6 text-center font-bold">
          {incrementViewError.message}
        </div>
      </div>
    </div>
  );
}

const isOwner: boolean | null | undefined =
  userData && userData.id === displayDeck?.creator_id;

return (
  <div className="flex min-h-screen flex-col">
    <div className="flex-grow pb-32">
      <DeckInfo
        displayDeck={displayDeck}
        deckslots={deckSlots || []}
        onUpdate={() => updateDeckMutation.mutate(params.id)}
        isOwner={isOwner}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div className="my-4 flex items-center justify-center space-x-2">
        {isOwner && <DeckPageDropDownMenu deckId={params.id} />}
        <Switch id="view-mode" onCheckedChange={toggleViewMode} />
        <Label htmlFor="view-mode">{viewMode === "en" ? "EN" : "KR"}</Label>
        {isOwner && <CardSearch deckId={params.id} viewMode={viewMode} />}
      </div>
      <DeckSlotDisplay
        deckslots={deckSlots || []}
        onUpdate={() => [
          updateDeckSlotsMutation.mutate(params.id),
          updateDeckMutation.mutate(params.id),
        ]}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isOwner={isOwner}
      />
      <DeckPageFooter deckslots={deckSlots || []} />
    </div>
  </div>
);
```

Here is the page during loading:
![Loading](/images/blog/expressots-error-handling-blog/loading.PNG)

Here is the page when an error occurs:
![Error](/images/blog/expressots-error-handling-blog/error.PNG)

Here is the page when the page successfully loads:
![Success1](/images/blog/expressots-error-handling-blog/success1.PNG)
![Success2](/images/blog/expressots-error-handling-blog/success2.PNG)

For reference, this is what the DeckView Page used to look like in its "toy" version:
![OldDeckView](/images/blog/cookiedeck-toy-blog/deck_view.PNG)

<a id="conclusion"></a>

## Conclusion

In this blog, we covered how to handle custom error responses using ExpressoTS, TanStack Query, and Next.js. By managing errors on both the backend and frontend, you can improve your app’s reliability and user experience. From backend error reporting to conditional rendering on the frontend, managing error states ensures your app is reliable. Thank you for reading, and I will see you in the next one!
