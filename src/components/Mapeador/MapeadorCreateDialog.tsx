"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import InputMask from "react-input-mask";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CreateMapeadorDialogProps,
  MapeadorFormData,
  mapeadorSchema,
} from "@/types/Mapeador";
import { DialogForm } from "../DialogForm";
import { useState } from "react";
import { CustomFormField } from "../CustomFormField";
import { DialogFooter } from "../ui/dialog";

export function MapeadorCreateDialog({ onCreate }: CreateMapeadorDialogProps) {
  const form = useForm<MapeadorFormData>({
    resolver: zodResolver(mapeadorSchema),
    defaultValues: {
      name: "",
      telephone: "",
      city: "",
      vehicle: "",
      pix: "",
      observations: "",
      lastMapping: undefined,
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async (data: MapeadorFormData) => {
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
      title="Novo mapeador"
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={
        <Button className="w-full sm:w-auto" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Novo mapeador
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
              placeholder="Nome do Mapeador"
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
            name="city"
            label="Cidade"
            placeholder="Cidade"
          />
          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veículo</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="Moto">
                        Moto
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Carro">
                        Carro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <CustomFormField
            control={form.control}
            name="pix"
            label="PIX"
            placeholder="Chave PIX"
          />
          <FormField
            control={form.control}
            name="lastMapping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Último Mapeamento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "dd/MM/yyyy")
                          : "Selecione uma data"}
                        <CalendarIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
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
