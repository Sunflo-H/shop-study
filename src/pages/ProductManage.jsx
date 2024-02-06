import { Outlet } from "react-router-dom";
import Header from "../components/ProductManagement/header/Header";
import Nav from "../components/ProductManagement/nav/Nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "../store";
import { useState } from "react";

export default function ProductManagement() {
  const queryClient = new QueryClient();
  const [item, setItem] = useState(1);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <div className="flex flex-col bg-gray-200 h-screen border-black border">
          <Header />
          <div className="flex self-center w-screen max-w-screen-2xl ">
            <Nav item={item} />
            <Outlet />
          </div>
        </div>
      </Provider>
    </QueryClientProvider>
  );
}
