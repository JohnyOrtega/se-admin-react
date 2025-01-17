import { proprietarioService } from "@/services/proprietarioService";
import { proprietarioSchema } from "@/types/Proprietario";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Imovel } from "@/types/Imovel";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { CustomFormField } from "../CustomFormField";
import TelephoneFormField from "../TelephoneFormField";
import CustomTag from "../CustomTag";
import { LoadingButton } from "../LoadingButton";
import Container from "../Container";
import LoadingPage from "../LoadingPage";
import { useToast } from "@/hooks/use-toast";
import { Address } from "@/types/Address";
import CepAutocomplete from "../CepAutocomplete";
import { RoleBasedAccess } from "../RoleBasedAccess";

export function ProprietarioDetails() {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof proprietarioSchema>>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues: {
      name: "",
      telephone: "",
      email: "",
      address: "",
      state: "",
      city: "",
      observations: "",
      source: "",
      cep: "",
    },
  });

  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [countImoveis, setCountImoveis] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchProprietario = async () => {
      try {
        setIsLoading(true);
        const response = await proprietarioService.getById(id);

        form.reset({
          name: response.name,
          telephone: response.telephone,
          email: response.email,
          address: response.address,
          neighborhood: response.neighborhood,
          state: response.state,
          city: response.city,
          observations: response.observations,
          source: response.source,
          cep: response.cep,
        });

        setImoveis(response.imoveis);
        setCountImoveis(response.imoveisCount);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar proprietário:", error);
        navigate("/proprietarios");
      }
    };

    if (id) {
      fetchProprietario();
    }
  }, [id, navigate, form]);

  const onSubmit = async (data: z.infer<typeof proprietarioSchema>) => {
    try {
      setIsButtonLoading(true);
      await proprietarioService.update(id!, { ...data, id });
      toast({
        title: "Proprietario atualizado com sucesso.",
        className: "bg-green-400 dark:text-zinc-900",
      });
      setIsButtonLoading(false);
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Algo deu errado.",
      });
    }
  };
  const handleAvailabilityTagColor = (key: string) => {
    const availabilityStyles: { [key: string]: string } = {
      Disponivel: "bg-green-500 text-white dark:text-zinc-900",
      Alugado: "bg-blue-500 text-white dark:text-zinc-900",
      Indisponivel: "bg-red-500 text-white dark:text-zinc-900",
      Motivo: "bg-purple-500 text-white dark:text-zinc-900",
    };

    return availabilityStyles[key] || "bg-gray-200";
  };

  const handleAddressChange = (address: Address) => {
    form.setValue("address", address.logradouro);
    form.setValue("neighborhood", address.bairro);
    form.setValue("city", address.cidade);
    form.setValue("state", address.uf);
    form.setValue("cep", address.cep);
  };

  return (
    <LoadingPage isLoading={isLoading}>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between mb-3 md:mb-0">
          <Button
            variant="outline"
            onClick={() => navigate("/proprietarios")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Proprietarios
          </Button>
          <RoleBasedAccess allowedRoles={["Admin", "Moderador"]}>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              {isEditing ? "Desabilitar edição" : "Habilitar edição"}
            </Button>
          </RoleBasedAccess>
        </div>
        <Container>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                (data) => {
                  onSubmit(data);
                },
                (errors) => {
                  console.error("Erros de validação:", errors);
                }
              )}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <CustomFormField
                  control={form.control}
                  name="name"
                  label="Nome"
                  placeholder="Nome do propretário"
                  disabled={!isEditing}
                />
                <TelephoneFormField
                  control={form.control}
                  name="telephone"
                  disabled={!isEditing}
                />
                <CustomFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Email"
                  disabled={!isEditing}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-2">
                <div className="w-full">
                  <CepAutocomplete
                    control={form.control}
                    name="cep"
                    onAddressChange={handleAddressChange}
                    disabled={!isEditing}
                  />
                </div>
                <CustomFormField
                  control={form.control}
                  name="address"
                  label="Logradouro"
                  placeholder="Logradouro"
                  disabled={!isEditing}
                />
                <CustomFormField
                  control={form.control}
                  name="neighborhood"
                  label="Bairro"
                  placeholder="Bairro"
                  disabled={!isEditing}
                />
                <CustomFormField
                  control={form.control}
                  name="state"
                  label="Estado"
                  placeholder="Estado"
                  disabled={!isEditing}
                />
                <CustomFormField
                  control={form.control}
                  name="city"
                  label="Cidade"
                  placeholder="Cidade"
                  disabled={!isEditing}
                />
                <CustomFormField
                  control={form.control}
                  name="source"
                  label="Fonte"
                  placeholder="Fonte"
                  disabled={!isEditing}
                />
              </div>
              <CustomFormField
                control={form.control}
                name="observations"
                label="Observações"
                placeholder="Observações"
                disabled={!isEditing}
              />

              <div className="flex justify-end">
                <LoadingButton
                  type="submit"
                  variant="default"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-purple-500 dark:hover:bg-purple-700 dark:text-white"
                  isLoading={isButtonLoading}
                >
                  <Save size={16} /> Salvar
                </LoadingButton>
              </div>
            </form>
          </Form>
        </Container>

        <Container className="mt-8">
          <div className="grid grid-cols-1 mb-5">
            <h2 className="text-2xl font-bold">Imóveis</h2>
            <span className="text-sm opacity-40">
              Quantidade: {countImoveis}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {imoveis.map((imovel) => (
              <Card
                key={imovel.id}
                onClick={() => {
                  navigate(`/imoveis/${imovel.id}`);
                }}
                className="cursor-pointer transition-all shadow-lg hover:border-orange-300"
              >
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>{imovel.address}</CardTitle>
                  <CustomTag
                    text={imovel.availability}
                    className={handleAvailabilityTagColor(imovel.availability)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <div>
                      <span className="font-bold">Cidade: </span>
                      {imovel.city}
                    </div>
                    <div>
                      <span className="font-bold">Área Total: </span>
                      {imovel.totalArea} m²
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {imoveis.length === 0 && (
            <p className="text-gray-500">Nenhum imóvel encontrado</p>
          )}
        </Container>
      </div>
    </LoadingPage>
  );
}
