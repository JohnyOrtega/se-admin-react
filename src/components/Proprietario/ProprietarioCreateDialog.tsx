"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import InputMask from "react-input-mask";
import { DialogForm } from "../DialogForm";
import { useState } from "react";
import {
  CreateProprietarioDialogProps,
  ProprietarioFormData,
  proprietarioSchema,
} from "@/types/Proprietario";
import { CustomFormField } from "../CustomFormField";
import { DialogFooter } from "../ui/dialog";

export function ProprietarioCreateDialog({
  onCreate,
}: CreateProprietarioDialogProps) {
  const form = useForm<ProprietarioFormData>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues: {
      name: "",
      source: "",
      telephone: "",
      address: "",
      neighboor: "",
      city: "",
      state: "",
      email: "",
      observations: "",
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const onSubmit = async (data: ProprietarioFormData) => {
    try {
      await onCreate(data);
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogForm
      title="Novo proprietario"
      open={isDialogOpen}
      onOpenChange={handleDialogChange}
      trigger={
        <Button className="w-full sm:w-auto" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Novo proprietario
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-3">
            <CustomFormField
              control={form.control}
              name="name"
              label="Nome"
              placeholder="Nome do Proprieatrio"
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <InputMask
                      mask="(99) 99999-9999"
                      maskChar="_"
                      placeholder="(00) 00000-0000"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    >
                      {(inputProps) => <Input {...inputProps} />}
                    </InputMask>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <CustomFormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
          />
          <div className="flex gap-3">
            <CustomFormField
              control={form.control}
              name="address"
              label="Endereço"
              placeholder="Endereço"
            />
            <CustomFormField
              control={form.control}
              name="neighboor"
              label="Bairro"
              placeholder="Bairro"
            />
          </div>
          <div className="flex gap-3">
            <CustomFormField
              control={form.control}
              name="city"
              label="Cidade"
              placeholder="Cidade"
            />
            <CustomFormField
              control={form.control}
              name="state"
              label="Estado"
              placeholder="Estado"
            />
          </div>
          <CustomFormField
            control={form.control}
            name="source"
            label="Fonte"
            placeholder="Fonte"
          />
          <CustomFormField
            control={form.control}
            name="observations"
            label="Observações"
            placeholder="Observações"
          />
          <DialogFooter>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogForm>
  );
}
