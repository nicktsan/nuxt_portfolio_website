---
title: "Launching the pilot of our testimonials collection site."
description: "Launching the pilot of our testimonials collection site."
date: 2026-01-18
cover: hackathon.webp
# tags:
#   - blog
---

Three days. A hackathon deadline. And a problem that non-profits quietly struggle with every day: collecting meaningful, usable testimonials at scale. What started as a scrappy prototype at [#HackVan2025](https://www.eventbrite.com/e/hackvan2025-vancouver-hackathon-by-faithtech-indigitous-tickets-1571577844639) has since grown into a production-ready pilot, officially launched on January 17, 2026. This post walks through how the project came together, the technical decisions behind it, and how we transformed a weekend experiment into a real-world tool built to last.

![landing_page](/images/blog/testimonials-pilot-launch-blog/landing-page-prod.png)

## Project Origins and Problem Statement

The idea of the project initially came from the HackVan2025 hackathon, hosted by [FaithTech](https://www.faithtech.com/). There were judges from several religious non-profit organizations with different problems. The contestants were allowed to choose which problem they wanted to tackle. The one I chose was for [City Reach](https://www.cityreach.org/), who had trouble collecting and processing testimonials from their volunteers. They needed a platform that was simple to use, allowed volunteers to submit text, audio, or video testimonials, and allowed organization admins to vet the submitted testimonials and download them. The platform also needed to transcribe media testimonials to text, as well as summarize them.

## Initial Hackathon Tech Stack

The team needed to build the solution within 3 days, so we prioritized solutions that were familiar, easy to use, and had generous free tiers. We decided on the following:

- Front and Back End: [NextJS](https://nextjs.org/). It is a popular and battle tested full stack [React](https://react.dev/) framework, which is perfect for prototyping, as devs don't need to worry about deploying separate front and back end infrastructure, especially when paired with the following platform.
- Deployment: [Vercel](https://vercel.com/). This is a PaaS (Platform as a Service) with a generous free tier, and it has the best DX of any PaaS at the moment and a CI/CD pipeline that is easy to configure. It also does some architecture optimization behind the scenes to make NextJS projects feel more performant, which you wouldn't get from deploying a NextJS project within a [Docker](https://www.docker.com/) container.
- Database: [Convex](https://www.convex.dev/). This BaaS (Back end as a Service) offers separate dev environments for each teammate in the free tier, as well as built in live database updates. Most other BaaS only offer separate environments in their paid tiers, which made Convex a clear winner for out team. Note: Convex is heavily opinionated in how it wants its users to query or mutate data, so if you plan on migrating to a different database later, it may not be the best choice for you.
- Speech to Text: [AssemblyAI](https://www.assemblyai.com/). An LLM that specializes in speech to text with a decent free tier with good quality.
- Text summarization: [Gemini](https://gemini.google.com/app). A well known solution with a decent free tier. Honestly, any cheap LLM can be used here, as they are all capable of summarizing text.
- File Storage: [Cloudflare R2](https://www.cloudflare.com/en-ca/developer-platform/products/r2/). Global object storage with zero egress fees. This makes this cheaper than the big 3 file storage options ([AWS S3](https://aws.amazon.com/s3/), [Google Cloud Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction), [Microsoft Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-introduction))

With the tech stack described above, the team was able to deploy a production ready prototype in 48 hours.

## Evolution from the Hackathon

The judge was pleased with our solution, and asked our team if we wanted to expand the project past the hackathon and develop a full fledge pilot. The team agreed. However, there would be several necessary changes to optimize the cost efficiency for a potentially long running product while adding security and analytics. I'll go over them below:

### Full Stack Framework and Deployment

In the hackathon, we used NextJS with Vercel for a smooth deployment experience. However, Vercel can be expensive at scale, and NextJS is [infamously difficult to host outside of Vercel](https://www.youtube.com/watch?v=E-w0R-leDMc) without sacrificing performance. (Apparently Vercel caches React Server Components in CDNs?). The team decided to migrate to [Tanstack Start](https://tanstack.com/start/latest) and [Cloudflare Workers](https://workers.cloudflare.com/). Cloudflare Workers is cheaper than Vercel at scale, and Tanstack Start is easier to host in environments outside of its official hosting partners without sacrificing too much performance. The Tanstack documentation also has guides on [migrating from NextJS](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js). Plus, trying out one of the newer frameworks in a production environment was too tempting to pass up.

### LLM Providers

The team switched to [Groq](https://groq.com/) for both speech-to-text and text summarization, as it is cheaper than both AssemblyAI and Gemini when you go past free tier limits.

### Media Compression

For the hackathon prototype, media was directly uploaded to Cloudflare R2 after users submitted their testionials. This is far from ideal, as uncompressed media will quickly eat up storage space and spike storage bills. Therefore, we added [Trigger.dev](https://trigger.dev/) to handle media compression in the background with [FFMpeg](https://www.ffmpeg.org/) (Open source media processing library). The Trigger documentation even includes examples for [processing video](https://trigger.dev/docs/guides/examples/ffmpeg-video-processing).

### Authentication

We initially used Convex's built in authentication, which is currently in beta. However, we decided to move on to [Better Auth](https://www.better-auth.com/), as it is more mature and feature rich, and the team and I didn't want to vendor-lock ourselves too much by relying on Convex's built in auth. Most importantly, Better Auth is free.

### Analytics

The prototype had no analytics. The team decided on [Posthog](https://posthog.com/), as it is an open source all-in-one platform. This means we don't need to subscribe to 30 different platforms for various analytics, such as error tracking, event capture, or session replay.

## Conclusion

What started as a hackathon project has evolved into a production-ready pilot focused on usability and cost efficiency. Along the way, we replaced early convenience-driven choices with more sustainable solutions while staying true to the original goal: making it easy for volunteers to share their testimonials and for organizations to manage them effectively. This launch is just the beginning, and the pilot now provides a strong foundation for iteration, feedback, and future growth.
