Next.js 15 is officially stable and ready for production. This release builds on the updates from both RC1 and RC2. We've focused heavily on stability while adding some exciting updates we think you'll love. Try Next.js 15 today:

terminal

# Use the new automated upgrade CLI
npx @next/codemod@canary upgrade latest
 
# ...or upgrade manually
npm install next@latest react@rc react-dom@rc
We're also excited to share more about what's coming next at Next.js Conf this Thursday, October 24th.

Here's what is new in Next.js 15:

@next/codemod CLI: Easily upgrade to the latest Next.js and React versions.
Async Request APIs (Breaking): Incremental step towards a simplified rendering and caching model.
Caching Semantics (Breaking): fetch requests, GET Route Handlers, and client navigations are no longer cached by default.
React 19 Support: Support for React 19, React Compiler (Experimental), and hydration error improvements.
Turbopack Dev (Stable): Performance and stability improvements.
Static Indicator: New visual indicator shows static routes during development.
unstable_after API (Experimental): Execute code after a response finishes streaming.
instrumentation.js API (Stable): New API for server lifecycle observability.
Enhanced Forms (next/form): Enhance HTML forms with client-side navigation.
next.config: TypeScript support for next.config.ts.
Self-hosting Improvements: More control over Cache-Control headers.
Server Actions Security: Unguessable endpoints and removal of unused actions.
Bundling External Packages (Stable): New config options for App and Pages Router.
ESLint 9 Support: Added support for ESLint 9.
Development and Build Performance: Improved build times and Faster Fast Refresh.
Smooth upgrades with @next/codemod CLI
We include codemods (automated code transformations) with every major Next.js release to help automate upgrading breaking changes.

To make upgrades even smoother, we've released an enhanced codemod CLI:

Terminal

npx @next/codemod@canary upgrade latest
This tool helps you upgrade your codebase to the latest stable or prerelease versions. The CLI will update your dependencies, show available codemods, and guide you through applying them.

The canary tag uses the latest version of the codemod while the latest specifies the Next.js version. We recommend using the canary version of the codemod even if you are upgrading to the latest Next.js version, as we plan to continue adding improvements to the tool based on your feedback.

Learn more about Next.js codemod CLI.

Async Request APIs (Breaking Change)
In traditional Server-Side Rendering, the server waits for a request before rendering any content. However, not all components depend on request-specific data, so it's unnecessary to wait for the request to render them. Ideally, the server would prepare as much as possible before a request arrives. To enable this, and set the stage for future optimizations, we need to know when to wait for the request.

Therefore, we are transitioning APIs that rely on request-specific data—such as headers, cookies, params, and searchParams—to be asynchronous.


import { cookies } from 'next/headers';
 
export async function AdminPanel() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
 
  // ...
}
This is a breaking change and affects the following APIs:

cookies
headers
draftMode
params in layout.js, page.js, route.js, default.js, generateMetadata, and generateViewport
searchParams in page.js
For an easier migration, these APIs can temporarily be accessed synchronously, but will show warnings in development and production until the next major version. A codemod is available to automate the migration:

Terminal

npx @next/codemod@canary next-async-request-api .
For cases where the codemod can't fully migrate your code, please read the upgrade guide. We have also provided an example of how to migrate a Next.js application to the new APIs.

Caching Semantics
Next.js App Router launched with opinionated caching defaults. These were designed to provide the most performant option by default with the ability to opt out when required.

Based on your feedback, we re-evaluated our caching heuristics and how they would interact with projects like Partial Prerendering (PPR) and with third party libraries using fetch.

With Next.js 15, we're changing the caching default for GET Route Handlers and the Client Router Cache from cached by default to uncached by default. If you want to retain the previous behavior, you can continue to opt-into caching.

We're continuing to improve caching in Next.js in the coming months and we'll share more details soon.

GET Route Handlers are no longer cached by default
In Next 14, Route Handlers that used the GET HTTP method were cached by default unless they used a dynamic function or dynamic config option. In Next.js 15, GET functions are not cached by default.

You can still opt into caching using a static route config option such as export dynamic = 'force-static'.

Special Route Handlers like sitemap.ts, opengraph-image.tsx, and icon.tsx, and other metadata files remain static by default unless they use dynamic functions or dynamic config options.

Client Router Cache no longer caches Page components by default
In Next.js 14.2.0, we introduced an experimental staleTimes flag to allow custom configuration of the Router Cache.

In Next.js 15, this flag still remains accessible, but we are changing the default behavior to have a staleTime of 0 for Page segments. This means that as you navigate around your app, the client will always reflect the latest data from the Page component(s) that become active as part of the navigation. However, there are still important behaviors that remain unchanged:

Shared layout data won't be refetched from the server to continue to support partial rendering.
Back/forward navigation will still restore from cache to ensure the browser can restore scroll position.
loading.js will remain cached for 5 minutes (or the value of the staleTimes.static configuration).
You can opt into the previous Client Router Cache behavior by setting the following configuration:

next.config.ts

const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};
 
export default nextConfig;
React 19
As part of the Next.js 15 release, we've made the decision to align with the upcoming release of React 19.

In version 15, the App Router uses React 19 RC, and we've also introduced backwards compatibility for React 18 with the Pages Router based on community feedback. If you're using the Pages Router, this allows you to upgrade to React 19 when ready.

Although React 19 is still in the RC phase, our extensive testing across real-world applications and our close work with the React team have given us confidence in its stability. The core breaking changes have been well-tested and won't affect existing App Router users. Therefore, we've decided to release Next.js 15 as stable now, so your projects are fully prepared for React 19 GA.

To ensure the transition is as smooth as possible, we've provided codemods and automated tools to help ease the migration process.

Read the Next.js 15 upgrade guide, the React 19 upgrade guide, and watch the React Conf Keynote to learn more.

Pages Router on React 18
Next.js 15 maintains backward compatibility for the Pages Router with React 18, allowing users to continue using React 18 while benefiting from improvements in Next.js 15.

Since the first Release Candidate (RC1), we've shifted our focus to include support for React 18 based on community feedback. This flexibility enables you to adopt Next.js 15 while using the Pages Router with React 18, giving you greater control over your upgrade path.

Note: While it is possible to run the Pages Router on React 18 and the App Router on React 19 in the same application, we don't recommend this setup. Doing so could result in unpredictable behavior and typings inconsistencies, as the underlying APIs and rendering logic between the two versions may not fully align.

React Compiler (Experimental)
The React Compiler is a new experimental compiler created by the React team at Meta. The compiler understands your code at a deep level through its understanding of plain JavaScript semantics and the Rules of React, which allows it to add automatic optimizations to your code. The compiler reduces the amount of manual memoization developers have to do through APIs such as useMemo and useCallback - making code simpler, easier to maintain, and less error prone.

With Next.js 15, we've added support for the React Compiler. Learn more about the React Compiler, and the available Next.js config options.

Note: The React Compiler is currently only available as a Babel plugin, which will result in slower development and build times.

Hydration error improvements
Next.js 14.1 made improvements to error messages and hydration errors. Next.js 15 continues to build on those by adding an improved hydration error view. Hydration errors now display the source code of the error with suggestions on how to address the issue.

For example, this was a previous hydration error message in Next.js 14.1:

Hydration error message in Next.js 14.1
Next.js 15 has improved this to:

Hydration error message improved in Next.js 15
Turbopack Dev
We are happy to announce that next dev --turbo is now stable and ready to speed up your development experience. We've been using it to iterate on vercel.com, nextjs.org, v0, and all of our other applications with great results.

For example, with vercel.com, a large Next.js app, we've seen:

Up to 76.7% faster local server startup.
Up to 96.3% faster code updates with Fast Refresh.
Up to 45.8% faster initial route compile without caching (Turbopack does not have disk caching yet).
You can learn more about Turbopack Dev in our new blog post.

Static Route Indicator
Next.js now displays a Static Route Indicator during development to help you identify which routes are static or dynamic. This visual cue makes it easier to optimize performance by understanding how your pages are rendered.


You can also use the next build output to view the rendering strategy for all routes.

This update is part of our ongoing efforts to enhance observability in Next.js, making it easier for developers to monitor, debug, and optimize their applications. We're also working on dedicated developer tools, with more details to come soon.

Learn more about the Static Route Indicator, which can be disabled.

Executing code after a response with unstable_after (Experimental)
When processing a user request, the server typically performs tasks directly related to computing the response. However, you may need to perform tasks such as logging, analytics, and other external system synchronization.

Since these tasks are not directly related to the response, the user should not have to wait for them to complete. Deferring the work after responding to the user poses a challenge because serverless functions stop computation immediately after the response is closed.

after() is a new experimental API that solves this problem by allowing you to schedule work to be processed after the response has finished streaming, enabling secondary tasks to run without blocking the primary response.

To use it, add experimental.after to next.config.js:

next.config.ts

const nextConfig = {
  experimental: {
    after: true,
  },
};
 
export default nextConfig;
Then, import the function in Server Components, Server Actions, Route Handlers, or Middleware.


import { unstable_after as after } from 'next/server';
import { log } from '@/app/utils';
 
export default function Layout({ children }) {
  // Secondary task
  after(() => {
    log();
  });
 
  // Primary task
  return <>{children}</>;
}
Learn more about unstable_after.

instrumentation.js (Stable)
The instrumentation file, with the register() API, allows users to tap into the Next.js server lifecycle to monitor performance, track the source of errors, and deeply integrate with observability libraries like OpenTelemetry.

This feature is now stable and the experimental.instrumentationHook config option can be removed.

In addition, we've collaborated with Sentry on designing a new onRequestError hook that can be used to:

Capture important context about all errors thrown on the server, including:
Router: Pages Router or App Router
Server context: Server Component, Server Action, Route Handler, or Middleware
Report the errors to your favorite observability provider.

export async function onRequestError(err, request, context) {
  await fetch('https://...', {
    method: 'POST',
    body: JSON.stringify({ message: err.message, request, context }),
    headers: { 'Content-Type': 'application/json' },
  });
}
 
export async function register() {
  // init your favorite observability provider SDK
}
Learn more about the onRequestError function.

<Form> Component
The new <Form> component extends the HTML <form> element with prefetching, client-side navigation, and progressive enhancement.

It is useful for forms that navigate to a new page, such as a search form that leads to a results page.

app/page.jsx

import Form from 'next/form';
 
export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  );
}
The <Form> component comes with:

Prefetching: When the form is in view, the layout and loading UI are prefetched, making navigation fast.
Client-side Navigation: On submission, shared layouts and client-side state are preserved.
Progressive Enhancement: If JavaScript hasn't loaded yet, the form still works via full-page navigation.
Previously, achieving these features required a lot of manual boilerplate. For example:

Learn more about the <Form> Component.

Support for next.config.ts
Next.js now supports the TypeScript next.config.ts file type and provides a NextConfig type for autocomplete and type-safe options:

next.config.ts

import type { NextConfig } from 'next';
 
const nextConfig: NextConfig = {
  /* config options here */
};
 
export default nextConfig;
Learn more about TypeScript support in Next.js.

Improvements for self-hosting
When self-hosting applications, you may need more control over Cache-Control directives.

One common case is controlling the stale-while-revalidate period sent for ISR pages. We've implemented two improvements:

You can now configure the expireTime value in next.config. This was previously the experimental.swrDelta option.
Updated the default value to one year, ensuring most CDNs can fully apply the stale-while-revalidate semantics as intended.
We also no longer override custom Cache-Control values with our default values, allowing full control and ensuring compatibility with any CDN setup.

Finally, we've improved image optimization when self-hosting. Previously, we recommended you install sharp for optimizing images on your Next.js server. This recommendation was sometimes missed. With Next.js 15, you no longer need to manually install sharp — Next.js will use sharp automatically when using next start or running with standalone output mode.

To learn more, see our new demo and tutorial video on self-hosting Next.js.

Enhanced Security for Server Actions
Server Actions are server-side functions that can be called from the client. They are defined by adding the 'use server' directive at the top of a file and exporting an async function.

Even if a Server Action or utility function is not imported elsewhere in your code, it's still a publicly accessible HTTP endpoint. While this behavior is technically correct, it can lead to unintentional exposure of such functions.

To improve security, we've introduced the following enhancements:

Dead code elimination: Unused Server Actions won't have their IDs exposed to the client-side JavaScript bundle, reducing bundle size and improving performance.
Secure action IDs: Next.js now creates unguessable, non-deterministic IDs to allow the client to reference and call the Server Action. These IDs are periodically recalculated between builds for enhanced security.

// app/actions.js
'use server';
 
// This action **is** used in our application, so Next.js
// will create a secure ID to allow the client to reference
// and call the Server Action.
export async function updateUserAction(formData) {}
 
// This action **is not** used in our application, so Next.js
// will automatically remove this code during `next build`
// and will not create a public endpoint.
export async function deleteUserAction(formData) {}
You should still treat Server Actions as public HTTP endpoints. Learn more about securing Server Actions.

Optimizing bundling of external packages (Stable)
Bundling external packages can improve the cold start performance of your application. In the App Router, external packages are bundled by default, and you can opt-out specific packages using the new serverExternalPackages config option.

In the Pages Router, external packages are not bundled by default, but you can provide a list of packages to bundle using the existing transpilePackages option. With this configuration option, you need to specify each package.

To unify configuration between App and Pages Router, we're introducing a new option, bundlePagesRouterDependencies to match the default automatic bundling of the App Router. You can then use serverExternalPackages to opt-out specific packages, if needed.

next.config.ts

const nextConfig = {
  // Automatically bundle external packages in the Pages Router:
  bundlePagesRouterDependencies: true,
  // Opt specific packages out of bundling for both App and Pages Router:
  serverExternalPackages: ['package-name'],
};
 
export default nextConfig;
Learn more about optimizing external packages.

ESLint 9 Support
Next.js 15 also introduces support for ESLint 9, following the end-of-life for ESLint 8 on October 5, 2024.

To ensure a smooth transition, Next.js remain backwards compatible, meaning you can continue using either ESLint 8 or 9.

If you upgrade to ESLint 9, and we detect that you haven't yet adopted the new config format, Next.js will automatically apply the ESLINT_USE_FLAT_CONFIG=false escape hatch to ease migration.

Additionally, deprecated options like —ext and —ignore-path will be removed when running next lint. Please note that ESLint will eventually disallow these older configurations in ESLint 10, so we recommend starting your migration soon.

For more details on these changes, check out the migration guide.

As part of this update, we've also upgraded eslint-plugin-react-hooks to v5.0.0, which introduces new rules for React Hooks usage. You can review all changes in the changelog for eslint-plugin-react-hooks@5.0.0.

Development and Build Improvements
Server Components HMR
During development, Server components are re-executed when saved. This means, any fetch requests to your API endpoints or third-party services are also called.

To improve local development performance and reduce potential costs for billed API calls, we now ensure Hot Module Replacement (HMR) can re-use fetch responses from previous renders.

Learn more about the Server Components HMR Cache.

Faster Static Generation for the App Router
We've optimized static generation to improve build times, especially for pages with slow network requests.

Previously, our static optimization process rendered pages twice—once to generate data for client-side navigation and a second time to render the HTML for the initial page visit. Now, we reuse the first render, cutting out the second pass, reducing workload and build times.

Additionally, static generation workers now share the fetch cache across pages. If a fetch call doesn't opt out of caching, its results are reused by other pages handled by the same worker. This reduces the number of requests for the same data.

Advanced Static Generation Control (Experimental)
We've added experimental support for more control over the static generation process for advanced use cases that would benefit from greater control.

We recommend sticking to the current defaults unless you have specific requirements as these options can lead to increased resource usage and potential out-of-memory errors due to increased concurrency.

next.config.ts

const nextConfig = {
  experimental: {
    // how many times Next.js will retry failed page generation attempts
    // before failing the build
    staticGenerationRetryCount: 1
    // how many pages will be processed per worker
    staticGenerationMaxConcurrency: 8
    // the minimum number of pages before spinning up a new export worker
    staticGenerationMinPagesPerWorker: 25
  },
}
 
export default nextConfig;
Learn more about the Static Generation options.

Other Changes
[Breaking] next/image: Removed squoosh in favor of sharp as an optional dependency (PR)
[Breaking] next/image: Changed default Content-Disposition to attachment (PR)
[Breaking] next/image: Error when src has leading or trailing spaces (PR)
[Breaking] Middleware: Apply react-server condition to limit unrecommended React API imports (PR)
[Breaking] next/font: Removed support for external @next/font package (PR)
[Breaking] next/font: Removed font-family hashing (PR)
[Breaking] Caching: force-dynamic will now set a no-store default to the fetch cache (PR)
[Breaking] Config: Enable swcMinify (PR), missingSuspenseWithCSRBailout (PR), and outputFileTracing (PR) behavior by default and remove deprecated options
[Breaking] Remove auto-instrumentation for Speed Insights (must now use the dedicated @vercel/speed-insights package) (PR)
[Breaking] Remove .xml extension for dynamic sitemap routes and align sitemap URLs between development and production (PR)
[Breaking] We've deprecated exporting export const runtime = "experimental-edge" in the App Router. Users should now switch to export const runtime = "edge". We've added a codemod to perform this (PR)
[Breaking] Calling revalidateTag and revalidatePath during render will now throw an error (PR)
[Breaking] The instrumentation.js and middleware.js files will now use the vendored React packages (PR)
[Breaking] The minimum required Node.js version has been updated to 18.18.0 (PR)
[Breaking] next/dynamic: the deprecated suspense prop has been removed and when the component is used in the App Router, it won't insert an empty Suspense boundary anymore (PR)
[Breaking] When resolving modules on the Edge Runtime, the worker module condition will not be applied (PR)
[Breaking] Disallow using ssr: false option with next/dynamic in Server Components (PR)
[Improvement] Metadata: Updated environment variable fallbacks for metadataBase when hosted on Vercel (PR)
[Improvement] Fix tree-shaking with mixed namespace and named imports from optimizePackageImports (PR)
[Improvement] Parallel Routes: Provide unmatched catch-all routes with all known params (PR)
[Improvement] Config bundlePagesExternals is now stable and renamed to bundlePagesRouterDependencies
[Improvement] Config serverComponentsExternalPackages is now stable and renamed to serverExternalPackages
[Improvement] create-next-app: New projects ignore all .env files by default (PR)
[Improvement] The outputFileTracingRoot, outputFileTracingIncludes and outputFileTracingExcludes have been upgraded from experimental and are now stable (PR)
[Improvement] Avoid merging global CSS files with CSS module files deeper in the tree (PR)
[Improvement] The cache handler can be specified via the NEXT_CACHE_HANDLER_PATH environment variable (PR)
[Improvement] The Pages Router now supports both React 18 and React 19 (PR)
[Improvement] The Error Overlay now displays a button to copy the Node.js Inspector URL if the inspector is enabled (PR)
[Improvement] Client prefetches on the App Router now use the priority attribute (PR)
[Improvement] Next.js now provides an unstable_rethrow function to rethrow Next.js internal errors in the App Router (PR)
[Improvement] unstable_after can now be used in static pages (PR)
[Improvement] If a next/dynamic component is used during SSR, the chunk will be prefetched (PR)
[Improvement] The esmExternals option is now supported on the App Router (PR)
[Improvement] The experimental.allowDevelopmentBuild option can be used to allow NODE_ENV=development with next build for debugging purposes (PR)
[Improvement] The Server Action transforms are now disabled in the Pages Router (PR)
[Improvement] Build workers will now stop the build from hanging when they exit (PR)
[Improvement] When redirecting from a Server Action, revalidations will now apply correctly (PR)
[Improvement] Dynamic params are now handled correctly for parallel routes on the Edge Runtime (PR)
[Improvement] Static pages will now respect staleTime after initial load (PR)
[Improvement] vercel/og updated with a memory leak fix (PR)
[Improvement] Patch timings updated to allow usage of packages like msw for APIs mocking (PR)
[Improvement] Prerendered pages should use static staleTime (PR)