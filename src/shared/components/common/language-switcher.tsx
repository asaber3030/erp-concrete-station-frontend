"use client";

import type { TDefaultLocales } from "#/shared/types";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { setLocale } from "#/shared/actions/locale";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export const LanguageSwitcher = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: TDefaultLocales) => setLocale({ data: { data } }),
    onSuccess: (data) => {
      alert(data);
      router.invalidate();
    },
    onError: (e) => {
      alert(e.message || "error");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Language</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => mutation.mutate("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutation.mutate("ar")}>
          Arabic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
