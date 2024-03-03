// 'use client';

// import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
// import { SessionProvider } from 'next-auth/react'
// import { FC, ReactNode, useState } from 'react'
// import { ThemeProvider } from "@/component/ThemeProvider"
// import { httpBatchLink, loggerLink } from "@trpc/client"
// import { trpc } from "@/app/trpc-client"
// import superjson from "superjson"

// interface LayoutProps {
//   children: ReactNode
// }

// const Providers: FC<LayoutProps> = ({ children }) => {
//   const [queryClient] = useState(() => new QueryClient())
//   const [trpcClient] = useState(() =>
//     trpc.createClient({
//       transformer: superjson,
//       links: [
//         loggerLink({
//           enabled: (opts) =>
//             process.env.NODE_ENV === "development" ||
//             (opts.direction === "down" && opts.result instanceof Error),
//         }),
//         httpBatchLink({
//           url: "http://localhost:3000/api/trpc",
//         })
//       ],
//     })
//   )
//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         <QueryClientProvider client={queryClient}>
//           <SessionProvider>{children}</SessionProvider>
//         </QueryClientProvider>
//       </ThemeProvider>
//     </trpc.Provider>
//   )
// }

// export default Providers
