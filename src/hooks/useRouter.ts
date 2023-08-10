import NProgress from "nprogress";
import { useRouter as useNextRouter } from "next/navigation";
import {
  NavigateOptions,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context";

const useRouter = (): AppRouterInstance => {
  const router = useNextRouter();

  const handlePush = (href: string, options?: NavigateOptions | undefined) => {
    NProgress.start();
    router.push(href, options);
  };

  return {
    ...router,
    push: handlePush,
  };
};

export default useRouter;
