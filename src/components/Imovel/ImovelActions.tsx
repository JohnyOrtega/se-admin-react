import { useState } from "react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ImovelFiltersProps } from "@/types/Imovel/filters";
import { DialogForm } from "../DialogForm";
import { ImovelCreateDialog } from "./ImovelCreateDialog";
import { ImovelFormData } from "@/types/Imovel";
import { imovelService } from "@/services/imovelService";
import { ProprietarioCombobox } from "../Proprietario/ProprietarioCombobox";
import InputFilter from "../InputFilter";
import { DialogFooter } from "../ui/dialog";

export function ImovelActions({
  activeFilters,
  onApplyFilters,
}: ImovelFiltersProps) {
  const [filterForm, setFilterForm] = useState({
    address: activeFilters.address || "",
    neighborhood: activeFilters.neighborhood || "",
    city: activeFilters.city || "",
    state: activeFilters.state || "",
    zone: activeFilters.zone || "",
    propertyProfile: activeFilters.propertyProfile || "",
    availability: activeFilters.availability || "",
    minRentValue: activeFilters.minRentValue || undefined,
    maxRentValue: activeFilters.maxRentValue || undefined,
    minSaleValue: activeFilters.minSaleValue || undefined,
    maxSaleValue: activeFilters.maxSaleValue || undefined,
    minIptuAnnual: activeFilters.minIptuAnnual || undefined,
    maxIptuAnnual: activeFilters.maxIptuAnnual || undefined,
    minIptuMonthly: activeFilters.minIptuMonthly || undefined,
    maxIptuMonthly: activeFilters.maxIptuMonthly || undefined,
    minSearchMeterage: activeFilters.minSearchMeterage || undefined,
    maxSearchMeterage: activeFilters.maxSearchMeterage || undefined,
    minTotalArea: activeFilters.minTotalArea || undefined,
    maxTotalArea: activeFilters.maxTotalArea || undefined,
    realEstate: activeFilters.realEstate || "",
    proprietarioId: activeFilters.proprietarioId || "",
    createdAt: activeFilters.createdAt || "",
    updatedAt: activeFilters.updatedAt || "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createdAtDate, setCreatedAtDate] = useState<Date | undefined>(
    activeFilters.createdAt ? new Date(activeFilters.createdAt) : undefined
  );
  const [updatedAtDate, setUpdatedAtDate] = useState<Date | undefined>(
    activeFilters.updatedAt ? new Date(activeFilters.updatedAt) : undefined
  );

  const handleFilterFormChange = (key: string, value: string) => {
    setFilterForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setCreatedAtDate(undefined);
    setUpdatedAtDate(undefined);
    setFilterForm({
      address: "",
      neighborhood: "",
      city: "",
      state: "",
      zone: "",
      propertyProfile: "",
      availability: "",
      minRentValue: undefined,
      maxRentValue: undefined,
      minSaleValue: undefined,
      maxSaleValue: undefined,
      minIptuAnnual: undefined,
      maxIptuAnnual: undefined,
      minIptuMonthly: undefined,
      maxIptuMonthly: undefined,
      minSearchMeterage: undefined,
      maxSearchMeterage: undefined,
      minTotalArea: undefined,
      maxTotalArea: undefined,
      realEstate: "",
      proprietarioId: "",
      createdAt: "",
      updatedAt: "",
    });
    onApplyFilters({ pageNumber: 1, pageSize: 10 });
  };

  const handleApplyFilters = () => {
    onApplyFilters({ ...activeFilters, ...filterForm, pageNumber: 1 });
    setIsDialogOpen(false);
  };

  const handleDate = (fieldName: string, selectedDate?: Date) => {
    const setters: { [key: string]: (date: Date | undefined) => void } = {
      updatedAtDate: setUpdatedAtDate,
      createdAtDate: setCreatedAtDate,
    };

    if (setters[fieldName]) {
      setters[fieldName](selectedDate);
    }

    handleFilterFormChange(
      fieldName,
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
    );
  };

  const handleCreateImovel = async (data: ImovelFormData) => {
    await imovelService.create(data);
    onApplyFilters({ ...activeFilters, ...filterForm, pageNumber: 1 });
  };

  return (
    <div className="w-full space-y-4 md:space-y-0 mb-5">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <ImovelCreateDialog
            onCreate={handleCreateImovel}
          ></ImovelCreateDialog>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <DialogForm
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title="Filtrar Imóvel"
            trigger={
              <Button className="w-full sm:w-auto">
                <Filter />
                Filtrar
              </Button>
            }
          >
            <>
              <Accordion type="multiple" className="w-full space-y-4 mb-5">
                <AccordionItem value="location">
                  <AccordionTrigger>Localização</AccordionTrigger>
                  <AccordionContent className="m-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <InputFilter
                        label="Logradouro"
                        placeholder="Filtrar por Logradouro"
                        type="text"
                        value={filterForm.address}
                        onChange={(e) =>
                          handleFilterFormChange("address", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Bairro"
                        placeholder="Filtrar por bairro"
                        type="text"
                        value={filterForm.neighborhood}
                        onChange={(e) =>
                          handleFilterFormChange("neighborhood", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Cidade"
                        placeholder="Filtrar por cidade"
                        type="text"
                        value={filterForm.city}
                        onChange={(e) =>
                          handleFilterFormChange("city", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Estado"
                        placeholder="Filtrar por estado"
                        type="text"
                        value={filterForm.state}
                        onChange={(e) =>
                          handleFilterFormChange("state", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Zona"
                        placeholder="Filtrar por zona"
                        type="text"
                        value={filterForm.zone}
                        onChange={(e) =>
                          handleFilterFormChange("zone", e.target.value)
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="property-details">
                  <AccordionTrigger>Detalhes do Imóvel</AccordionTrigger>
                  <AccordionContent className="m-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <InputFilter
                        label="Perfil do Imóvel"
                        placeholder="Filtrar perfil"
                        type="text"
                        value={filterForm.propertyProfile}
                        onChange={(e) =>
                          handleFilterFormChange(
                            "propertyProfile",
                            e.target.value
                          )
                        }
                      />
                      <InputFilter
                        label="Disponibilidade"
                        placeholder="Filtrar disponibilidade"
                        type="text"
                        value={filterForm.availability}
                        onChange={(e) =>
                          handleFilterFormChange("availability", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Imobiliária"
                        placeholder="Filtrar imobiliária"
                        type="text"
                        value={filterForm.realEstate}
                        onChange={(e) =>
                          handleFilterFormChange("realEstate", e.target.value)
                        }
                      />
                      <ProprietarioCombobox
                        value={filterForm.proprietarioId}
                        onChange={(value) =>
                          handleFilterFormChange("proprietarioId", value || "")
                        }
                        label="Proprietário"
                        placeholder="Selecione um proprietário"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="values">
                  <AccordionTrigger>Valores</AccordionTrigger>
                  <AccordionContent className="m-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <InputFilter
                        label="Valor Mín Aluguel"
                        placeholder="Filtrar mínimo"
                        type="number"
                        value={filterForm.minRentValue}
                        onChange={(e) =>
                          handleFilterFormChange("minRentValue", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Valor Máx Aluguel"
                        placeholder="Filtrar máximo"
                        type="number"
                        value={filterForm.maxRentValue}
                        onChange={(e) =>
                          handleFilterFormChange("maxRentValue", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Valor Mín Venda"
                        placeholder="Filtrar mínimo"
                        type="number"
                        value={filterForm.minSaleValue}
                        onChange={(e) =>
                          handleFilterFormChange("minSaleValue", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Valor Máx Venda"
                        placeholder="Filtrar máximo"
                        type="number"
                        value={filterForm.maxSaleValue}
                        onChange={(e) =>
                          handleFilterFormChange("maxSaleValue", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Mín IPTU Anual"
                        placeholder="Filtrar mínimo"
                        type="number"
                        value={filterForm.minIptuAnnual}
                        onChange={(e) =>
                          handleFilterFormChange(
                            "minIptuAnnual",
                            e.target.value
                          )
                        }
                      />
                      <InputFilter
                        label="Máx IPTU Anual"
                        placeholder="Filtrar máximo"
                        type="number"
                        value={filterForm.maxIptuAnnual}
                        onChange={(e) =>
                          handleFilterFormChange(
                            "maxIptuAnnual",
                            e.target.value
                          )
                        }
                      />
                      <InputFilter
                        label="Mín IPTU Mensal"
                        placeholder="Filtrar mínimo"
                        type="number"
                        value={filterForm.minIptuMonthly}
                        onChange={(e) =>
                          handleFilterFormChange(
                            "minIptuMonthly",
                            e.target.value
                          )
                        }
                      />
                      <InputFilter
                        label="Máx IPTU Mensal"
                        placeholder="Filtrar máximo"
                        type="number"
                        value={filterForm.maxIptuMonthly}
                        onChange={(e) =>
                          handleFilterFormChange(
                            "maxIptuMonthly",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="meterage">
                  <AccordionTrigger>Metragem</AccordionTrigger>
                  <AccordionContent className="m-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <InputFilter
                        label="Metragem Mín"
                        placeholder="Filtrar mínimo"
                        type="number"
                        value={filterForm.minSearchMeterage}
                        onChange={(e) =>
                          handleFilterFormChange(
                            "minSearchMeterage",
                            e.target.value
                          )
                        }
                      />
                      <InputFilter
                        label="Metragem Máx"
                        placeholder="Filtrar máximo"
                        type="number"
                        value={filterForm.maxSearchMeterage}
                        onChange={(e) =>
                          handleFilterFormChange(
                            "maxSearchMeterage",
                            e.target.value
                          )
                        }
                      />
                      <InputFilter
                        label="Área Total Mín"
                        placeholder="Filtrar mínimo"
                        type="number"
                        value={filterForm.minTotalArea}
                        onChange={(e) =>
                          handleFilterFormChange("minTotalArea", e.target.value)
                        }
                      />
                      <InputFilter
                        label="Área Total Máx"
                        placeholder="Filtrar máxima"
                        type="number"
                        value={filterForm.maxTotalArea}
                        onChange={(e) =>
                          handleFilterFormChange("maxTotalArea", e.target.value)
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="system-info">
                  <AccordionTrigger>Informações do Sistema</AccordionTrigger>
                  <AccordionContent className="m-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <InputFilter
                        type="date"
                        label="Data de criação"
                        placeholder="Selecione uma data"
                        date={createdAtDate}
                        fieldName="createdAtDate"
                        handleDate={handleDate}
                      />
                      <InputFilter
                        type="date"
                        label="Data de atualização"
                        placeholder="Selecione uma data"
                        date={updatedAtDate}
                        fieldName="updatedAtDate"
                        handleDate={handleDate}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full sm:w-auto"
                >
                  Limpar Filtros
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="w-full sm:w-auto"
                >
                  Aplicar
                </Button>
              </DialogFooter>
            </>
          </DialogForm>
        </div>
      </div>
    </div>
  );
}
