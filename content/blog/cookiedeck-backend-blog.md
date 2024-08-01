---
title: "Building the Back End of a Deck-Building Site: A Brief Look into ExpressoTS"
description: "Explore the inner workings of my deck-building site with a quick peak into the back end powered by ExpressoTS."
date: 2024-07-31
cover: cookie_at_computer.png
# tags:
#   - blog
---

If you've ever wondered what makes a deck-building site tick, you're in the right place. Today, we're taking a peak at the back end code, powered by the ExpressoTS framework, which has a few tricks up its sleeve to streamline the developer experience. This blog will showcase how I handle deck creation, request validation, and user authentication.

Let's start off with the Deck Creation controller.

```ts
//  ./src/deck/create/deck-create.controller.ts
import {
  Post,
  body,
  controller,
  request,
  response,
} from "@expressots/adapter-express";
import { BaseController, StatusCode, ValidateDTO } from "@expressots/core";
import { DeckCreateUsecase } from "./deck-create.usecase";
import cookieParser from "cookie-parser";
import { IDeckCreateRequestDto } from "./deck-create.dto";
import { Response, Request } from "express";
import { AuthSupabaseMiddleware } from "../../auth/supabase/auth-supabase.middleware";

@controller("/deck/create")
export class DeckCreateController extends BaseController {
  constructor(private deckCreateUsecase: DeckCreateUsecase) {
    super();
  }
  @Post(
    "",
    cookieParser(),
    ValidateDTO(IDeckCreateRequestDto),
    AuthSupabaseMiddleware
  )
  async execute(
    @body() payload: IDeckCreateRequestDto,
    @response() res: Response,
    @request() req: Request
  ): Promise<void> {
    return this.callUseCase(
      await this.deckCreateUsecase.execute(
        payload,
        req.headers["userid"] as string
      ),
      res,
      StatusCode.Created
    );
  }
}
```

To explain what is happening in the code: I am creating a controller class that handles requests from the client, validates its payload, and sends a response back to the client. The "BaseController" class that's being extended includes the "callUseCase" method, which is a helper function responsible for calling the use case that implements the business logic and returning a response to the front end. Within the route declaration, I'm using several middlewares: ["cookieParser"](https://www.npmjs.com/package/cookie-parser) for parsing cookies in the request, "ValidateDTO" to check if the request body matches the specified format (IDeckCreateRequestDto in this case), and "AuthSupabaseMiddleWare", which checks if the request is coming from a logged in user. Please note that ExpressoTS does not automatically install cookieParser. To install it and its type definitions, run the following commands:

```
npm i cookie-parser
npm i -D @types/cookie-parser
```

To perform DTO (Data Transfer Object) validation, I have to create a DTO class and define the variables in the class with decorators from the ["class-validator"](https://www.npmjs.com/package/class-validator) library. Here is the code for defining the structure of the request and response DTOs.

```ts
// ./src/deck/create/deck-create.dto.ts
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
export class IDeckCreateRequestDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsString({ message: "Name must be at least 3 characters long." })
  name: string;

  @IsOptional()
  @IsUUID()
  folder_id?: string | null;

  @IsOptional()
  @IsString({ message: "folder_id must be a string or empty" })
  description?: string | null;

  @IsIn(["public", "private", "unlisted"], {
    message: "Visibility must be either public, private, or unlisted",
  })
  visibility: "public" | "private" | "unlisted";
}

export interface IDeckCreateResponseDto {
  id: string;
  message: string;
}
```

Please note "class-validator" and ["class-transformer"](https://www.npmjs.com/package/class-transformer) are needed for ExpressoTS' "ValidateDTO" method to work. ExpressoTS does not install them automatically. To install "class-validator" and "class-transformer", run the following commands:

```
npm install class-validator --save
npm install class-transformer --save
```

Here is the code for "AuthSupabaseMiddleWare":

```ts
// ./src/auth/supabase/auth-supabase.middleware.ts
import { NextFunction, Request, Response } from "express";
import { SupabaseProvider } from "./supabase.provider";
import { SupabaseClient } from "@supabase/supabase-js";
import { ISupabaseClientContext } from "./supabase.client.context";
import { container } from "../../app.container";

function getToken(req: Request): string | undefined {
  if (req.headers.authorization) {
    const authHeaderSplit = req.headers.authorization.split(" ");
    if (authHeaderSplit.length > 1 && authHeaderSplit[0] === "Bearer") {
      return authHeaderSplit[1];
    }
  }
  return undefined;
}

//Denies access to the route if the user is unauthorized.
export async function AuthSupabaseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const supabaseProvider: SupabaseProvider = container.get(SupabaseProvider);
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: "No authorization token." });
    return;
  }
  const context: ISupabaseClientContext = {
    reqCookies: req.cookies,
    res: res,
  };
  const supabase: SupabaseClient =
    supabaseProvider.createSupabaseClient(context);
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) throw error;

    req.headers["userid"] = user?.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
```

First, the code looks for a Bearer token that contains the access token from the client. If there is no access token, the request is denied, and an error is returned to the client. If a Bearer token is found, the code checks if it is valid with "supabase.auth.getUser(token)". Upon successful token validation, the user ID is passed to the request header. Otherwise, an invalid token error is sent to the client. You may have noticed that the code is able to instantiate an instance of a Supabase provider class with ExpressoTS' built in support for dependency injection:

```ts
const supabaseProvider: SupabaseProvider = container.get(SupabaseProvider);
```

This can be done because I've added a "@provide" decorator to my "SupabaseProvider" class. Here is the code for said class:

```ts
// ./src/auth/supabase/supabase.provider.ts
import { provide } from "inversify-binding-decorators";
import { SupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { ISupabaseClientContext } from "./supabase.client.context";
import { ENV } from "../../../src/env";

@provide(SupabaseProvider)
export class SupabaseProvider {
  public createSupabaseClient(context: ISupabaseClientContext): SupabaseClient {
    return createServerClient(
      ENV.SUPABASE.SUPABASE_URL!,
      ENV.SUPABASE.SUPABASE_PUBLIC_ANON_KEY!,
      {
        cookies: {
          get: (key) => {
            const cookies = context.reqCookies;
            let cookie: string = "";
            if (cookies) {
              cookie = cookies[key] ?? "";
            }
            return decodeURIComponent(cookie);
          },
          set: (key, value, options) => {
            if (!context.res) return;
            context.res.cookie(key, encodeURIComponent(value), {
              ...options,
              sameSite: "Lax",
              httpOnly: true,
            });
          },
          remove: (key, options) => {
            if (!context.res) return;
            context.res.cookie(key, "", { ...options, httpOnly: true });
          },
        },
      }
    );
  }
}
```

By adding the "@provide" decorator the "SupabaseProvider" class, I've binded it to a dependency injection container at Request Scope. Conveniently, if you create a project with the ExpressoTS CLI, it will set up the dependency injection container for you, saving you the hassle of having to do it yourself.

```
npm i -g @expressots/cli
expressots new <project-name>
```

Please note I'm using [@supabase/ssr](https://www.npmjs.com/package/@supabase/ssr?activeTab=versions) v0.3.0 and [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js/v/1.13.1?activeTab=versions) v2.43.5, so the code may not work for the latest versions of the aforementioned supabase packages.

Now that I've covered the controller, let's move on to the use case, where the business logic is defined:

```ts
// ./src/deck/create/deck-create.usecase.ts
import { provide } from "inversify-binding-decorators";
import {
  IDeckCreateRequestDto,
  IDeckCreateResponseDto,
} from "./deck-create.dto";
import { DeckRepository } from "../deck.repository";
import { DeckEntity } from "../deck.entity";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckCreateUsecase)
export class DeckCreateUsecase {
  constructor(
    private deckRepository: DeckRepository,
    private newDeck: DeckEntity,
    private report: Report
  ) {}
  public async execute(
    payload: IDeckCreateRequestDto,
    userId: string
  ): Promise<IDeckCreateResponseDto | AppError> {
    try {
      this.newDeck.name = payload.name;
      this.newDeck.creator_id = userId;
      this.newDeck.folder_id = payload.folder_id;
      this.newDeck.description = payload.description;
      this.newDeck.visibility = payload.visibility;

      const res: DeckEntity | null = await this.deckRepository.create(
        this.newDeck
      );
      if (!res) {
        const error = this.report.error(
          "Failed to create deck.",
          StatusCode.BadRequest,
          "Failed to create deck."
        );
        throw error;
      }
      return {
        id: res.id,
        message: "Deck created successfully",
      };
    } catch (error: any) {
      console.log("Error occured during deck creation:");
      throw error;
    }
  }
}
```

Notice how I've added the "@provide" decorator to the "DeckCreateUsecase" class, which allows me to inject it as a dependency in the constructor for my "DeckCreateController" class. The "@provide" decorator has also been added to both the "DeckEntity" and "DeckRepository" classes (repositories are classes containing data access logic, such as Create, Read, Update, and Delete operations), which have been injected as dependencies in DeckCreateUsecase' constructor. To briefly explain what the use case does, it passes the request payload as a "DeckEntity" object (Entities are objects that are used to represent the data that is going to be manipulated by the application) to the "DeckRepository's" create method. If deck creation is successful, it returns a success response, and throws and error if deck creation failed.

Here is the code for the "DeckEntity" class:

```ts
// ./src/deck/deck.entity.ts
import { provide } from "inversify-binding-decorators";
import { IEntity } from "../base.entity";
import { v4 as uuidv4 } from "uuid";

@provide(DeckEntity)
export class DeckEntity implements IEntity {
  id: string;
  name?: string;
  creator_id?: string;
  username?: string;
  folder_id?: string | null;
  banner?: number | null;
  description?: string | null;
  views?: number;
  visibility?: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  constructor() {
    this.id = uuidv4();
  }
}
```

Here is the code for "DeckRepository":

```ts
// ./src/deck/deck.repository.ts
import { deckTable } from "../supabase/migrations/schema";
import { DeckEntity } from "./deck.entity";
import { BaseRepository } from "../base-repository";
@provide(DeckRepository)
export class DeckRepository extends BaseRepository<DeckEntity> {
  constructor() {
    super();
    this.table = deckTable;
  }
}
```

The "create" method isn't actually defined within the "DeckRepository" class. Instead, it is inherited from the "BaseRepository" class. The "DeckRepository" class merely defines which table ("deckTable" in this case) will be used for data insertion. The table schema can be found below:

```ts
// ./src/supabase/migrations/schema.ts
import {
  pgTable,
  index,
  unique,
  integer,
  text,
  timestamp,
  uuid,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
export const deckTable = pgTable(
  "deck",
  {
    id: uuid("id").primaryKey().notNull(),
    name: text("name").unique().notNull(),
    creator_id: uuid("creator_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    folder_id: uuid("folder_id").references(() => deckFolderTable.id, {
      onDelete: "cascade",
    }),
    banner: integer("banner").references(() => cards.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    views: integer("views").notNull().default(0),
    visibility: text("visibility").notNull().default("public"),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    name_lower: text("name_lower"),
  },
  (table) => ({
    nameIndex: uniqueIndex("unique_name_case_insensitive").on(
      sql`lower(${table.name})`
    ),
    trgm_idx_deck_name: index("trgm_idx_deck_name").using(
      "gin",
      table.name_lower
    ),
    deck_name_unique: unique("deck_name_unique").on(table.name),
  })
);
```

As you may have guessed, I'm using [Drizzle](https://orm.drizzle.team/) to help define the table schema.
As for the create method in the "BaseRepository" class, the code can be found below:

```ts
// ./src/base-repository.ts
import "reflect-metadata";
import { IEntity } from "./base.entity";
import { DrizzleProvider } from "./db/drizzle/drizzle.provider";
import { container } from "./app.container";
import { provide } from "inversify-binding-decorators";
import { IBaseRepository } from "./base-repository.interface";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

@provide(BaseRepository)
export class BaseRepository<T extends IEntity> implements IBaseRepository<T> {
  protected db: NodePgDatabase<Record<string, never>>;
  protected table: PgTableWithColumns<any>;

  constructor() {
    this.db = container.get(DrizzleProvider).Drizzle;
  }

  async create(item: T): Promise<T | null> {
    try {
      const res = await this.db
        .insert(this.table)
        .values(item)
        .returning({ id: this.table.id });
      return res[0] as T;
    } catch (error) {
      console.log("error occured while creating: ");
      console.log(error);
      return null;
    }
  }
}
```

The "create" method inserts the values defined in the item parameter into the table, which was defined in the constructor of the "DeckRepository" class. It then returns the ID of the newly created row upon a successful insertion, or null upon a failed insertion. The "DrizzleProvider" class establishes a connection to my [PostGres](https://www.postgresql.org/) database using Drizzle ORM and a singleton instance of a PostGres pool:

```ts
// ./src/db/drizzle/drizzle.provider.ts
import { provideSingleton } from "@expressots/core";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { postgres_pool_config } from "./postgres/postgresDB";

/**
 * Provider to inject the database pool into the container.
 */

@provideSingleton(DrizzleProvider)
export class DrizzleProvider {
  private pool: Pool | null = null;
  private db: NodePgDatabase<Record<string, never>> | null = null;

  private constructor() {}
  private initPool(): void {
    if (!this.pool) {
      this.pool = new Pool(postgres_pool_config);
      console.log("Pool created");
    } else {
      // console.log("Pool already exists");
    }
    // console.log(pool)
  }

  public get Pool(): Pool {
    this.initPool();
    return this.pool;
  }

  public get Drizzle(): NodePgDatabase<Record<string, never>> {
    this.initPool();
    if (!this.db) {
      this.db = drizzle(this.pool);
      console.log("Drizzle created");
    } else {
      // console.log("Drizzle already exists");
    }
    // console.log(db)
    return this.db;
  }

  public get closePool(): boolean {
    try {
      if (this.pool) {
        this.pool.end();
        console.log("Pool closed");
      }
    } catch (error) {
      console.log("Error while closing pool");
      console.log(error);
      return false;
    }
    return true;
  }
}
```

The "postgres_pool_config" parameter contains the configuration settings for instantiating a PostGres pool. The code for "postgres_pool_config" is defined below:

```ts
// ./src/db/drizzle/postgres/postgresDB.ts
import { ENV } from "../../../../src/env";
/**
 * Configuration of the database pool.
 */
export const postgres_pool_config = {
  host: ENV.DB.DB_HOST,
  port: ENV.DB.DB_PORT,
  user: ENV.DB.DB_USER,
  password: ENV.DB.DB_PASSWORD,
  database: ENV.DB.DB_NAME,
};
```

You may have noticed I'm not directly calling environment variables with process.env, but with a custom "env.ts" file instead. This allows developers to call environment variables with spell checking, which is not possible with process.env.

![environment_variable_spellcheck](/images/blog/cookiedeck-backend-blog/environment_variable_spellcheck.png)

My "env.ts" file is defined below:

```ts
// ./src/env.ts
export const ENV = {
  CORS: {
    FRONTEND_ORIGIN: String(process.env.FRONTEND_ORIGIN || "localhost:3000"),
  },
  DB: {
    DATABASE_URL: String(process.env.DATABASE_URL),
    DB_HOST: String(process.env.DB_HOST),
    DB_NAME: String(process.env.DB_NAME),
    DB_PORT: Number(process.env.DB_PORT),
    DB_USER: String(process.env.DB_USER),
    DB_PASSWORD: String(process.env.DB_PASSWORD),
  },
  SUPABASE: {
    SUPABASE_URL: String(process.env.SUPABASE_URL),
    SUPABASE_PUBLIC_ANON_KEY: String(process.env.SUPABASE_PUBLIC_ANON_KEY),
  },
};
```

By leveraging ExpressoTS, I was able to streamline the development process with its organized structure and dependency injection capabilities. We explored how controllers handle incoming requests, validate payloads, and ensure secure user authentication with Supabase. Additionally, we delved into the use case layer where business logic is implemented and entities are manipulated, followed by the repository layer responsible for data access. Finally, I utilized Drizzle ORM to interact with my PostgreSQL database. I hope you enjoyed this quick rundown of the back end code, and I hope to see you in the next blog!
