//
// Copyright © 2025 Agora
// This file is part of TEN Framework, an open source project.
// Licensed under the Apache License, Version 2.0, with certain conditions.
// Refer to the "LICENSE" file in the root directory for more information.
//

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { z } from "zod";
import { updatePreferencesLogViewerLines } from "@/api/services/storage";
import { LanguageToggle } from "@/components/lang-switch";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/use-theme";
import { cn } from "@/lib/utils";
import { useAppStore, useWidgetStore } from "@/store";
import {
  EPreferencesLocale,
  EPreferencesTabs,
  PREFERENCES_SCHEMA_LOG,
} from "@/types/apps";
import type { IWidget } from "@/types/widgets";

export const PreferencesWidgetTitle = () => {
  const { t } = useTranslation();
  return t("header.menuDesigner.preferences");
};

export const PreferencesWidgetContent = (props: { widget: IWidget }) => {
  const { t } = useTranslation();
  const { removeWidget } = useWidgetStore();

  const onClose = () => {
    removeWidget(props.widget.widget_id);
  };

  return (
    <Tabs defaultValue={EPreferencesTabs.GENERAL} className="w-full">
      <TabsList className={cn("grid w-full grid-cols-2")}>
        <TabsTrigger value={EPreferencesTabs.GENERAL}>
          {t("preferences.general.title")}
        </TabsTrigger>
        <TabsTrigger value={EPreferencesTabs.LOG}>
          {t("preferences.log.title")}
        </TabsTrigger>
      </TabsList>
      <TabsContent className="h-full" value={EPreferencesTabs.GENERAL}>
        <PreferencesGeneralTab />
      </TabsContent>
      <TabsContent className="h-full" value={EPreferencesTabs.LOG}>
        <PreferencesLogTab onCancel={onClose} />
      </TabsContent>
    </Tabs>
  );
};

export const PreferencesGeneralTab = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const getLangLabel = (lang: string) => {
    switch (lang) {
      case EPreferencesLocale.EN_US:
        return t("header.language.enUS");
      case EPreferencesLocale.ZH_CN:
        return t("header.language.zhCN");
      case EPreferencesLocale.ZH_TW:
        return t("header.language.zhTW");
      case EPreferencesLocale.JA_JP:
        return t("header.language.jaJP");
      default:
        return t("preferences.general.language");
    }
  };
  const getThemeLabel = (theme?: string) => {
    switch (theme) {
      case "light":
        return t("header.theme.light");
      case "dark":
        return t("header.theme.dark");
      case "system":
        return t("header.theme.system");
      default:
        return t("preferences.general.theme");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label>{t("preferences.general.language")}</Label>
        <LanguageToggle
          buttonProps={{
            className: "w-fit px-2 font-normal",
            children: getLangLabel(i18n.language),
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Label>{t("preferences.general.theme")}</Label>
        <ModeToggle
          hideIcon
          buttonProps={{
            className: "w-fit px-2 font-normal",
            children: getThemeLabel(theme),
          }}
        />
      </div>
    </div>
  );
};

export const PreferencesLogTab = (props: {
  onCancel?: () => void;
  onSave?: (values: z.infer<typeof PREFERENCES_SCHEMA_LOG>) => void;
}) => {
  const { t } = useTranslation();
  const { preferences, setPreferences } = useAppStore();
  const form = useForm<z.infer<typeof PREFERENCES_SCHEMA_LOG>>({
    resolver: zodResolver(PREFERENCES_SCHEMA_LOG),
    defaultValues: preferences,
  });

  const onSubmit = async (values: z.infer<typeof PREFERENCES_SCHEMA_LOG>) => {
    try {
      const parsedValues = PREFERENCES_SCHEMA_LOG.safeParse(values);
      if (!parsedValues.success) {
        throw new Error("Invalid values");
      }
      await updatePreferencesLogViewerLines(
        parsedValues.data.logviewer_line_size
      );
      setPreferences(
        "logviewer_line_size",
        parsedValues.data.logviewer_line_size
      );
      props.onSave?.(parsedValues.data);
      toast.success(t("preferences.saved"), {
        description: t("preferences.savedSuccess", {
          key: EPreferencesTabs.LOG,
        }),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("preferences.saveFailed"));
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="logviewer_line_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("preferences.log.maxLines")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={Number(field.value)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                {t("preferences.log.maxLinesDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-auto flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            {t("preferences.cancel")}
          </Button>
          <Button type="submit">{t("preferences.save")}</Button>
        </div>
      </form>
    </Form>
  );
};
