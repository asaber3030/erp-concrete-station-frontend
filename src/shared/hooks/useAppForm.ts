import { createFormHook } from "@tanstack/react-form";


import { TextField } from "#/shared/components/form/text-field";
import { TextareaField } from "#/shared/components/form/textarea-field";
import { NumberField } from "#/shared/components/form/number-field";
import { DateField } from "#/shared/components/form/date-field";
import { SelectField } from "#/shared/components/form/select-field";
import { ComboboxField } from "#/shared/components/form/combobox-field";
import { CheckboxField } from "#/shared/components/form/checkbox-field";
import { RadioGroupField } from "#/shared/components/form/radio-group-field";
import { SwitchField } from "#/shared/components/form/switch-field";
import {
  SubmitButton,
  ResetButton,
} from "#/shared/components/form/buttons";
import { fieldContext, formContext } from "../lib/form";
import { DateRangeField } from "../components/form/daterange-field";
import { CheckboxGroupField } from "../components/form/checkbox-group";

/**
 * The one hook to import everywhere instead of `useForm` from
 * @tanstack/react-form. It gives you `form.AppField` with every field
 * helper below pre-bound, plus `form.AppForm` for SubmitButton/ResetButton.
 *
 * Usage:
 *   const form = useAppForm({
 *     defaultValues: { name: "" },
 *     validators: { onSubmit: schema },
 *     onSubmit: async ({ value }) => { ... },
 *   })
 *
 *   <form.AppField name="name">
 *     {(field) => <field.TextField label="Name" />}
 *   </form.AppField>
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    NumberField,
    DateField,
    DateRangeField,
    SelectField,
    ComboboxField,
    CheckboxField,
    CheckboxGroupField,
    RadioGroupField,
    SwitchField,
  },
  formComponents: {
    SubmitButton,
    ResetButton,
  },
});
