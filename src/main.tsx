import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createRouter, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "@/routeTree.gen.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        }
    }
});

const router = createRouter({
    context: () => ({ queryClient: queryClient }),
    routeTree,
    basepath: '/ani-dash',
});
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={ router } />
      </QueryClientProvider>
  </StrictMode>,
)
