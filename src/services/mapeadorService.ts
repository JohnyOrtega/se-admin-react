import { PaginationResponse } from "@/types/pagination";
import {
  Mapeador,
  MapeadorFormData,
  MapeadorWithHistorico,
} from "../types/Mapeador";
import endpoints from "./endpoints";
import api from "./api";
import { MapeadorFilterParams } from "@/types/Mapeador/filters";

export const mapeadorService = {
  async get(filters: MapeadorFilterParams) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<PaginationResponse<Mapeador>>(
      `${endpoints.mapeador}?${params.toString()}`
    );

    return response.data;
  },

  async create(data: MapeadorFormData) {
    const response = await api.post<Mapeador>(endpoints.mapeador, data);
    return response.data;
  },

  async update(id: string, data: Partial<Mapeador>) {
    const response = await api.put<Mapeador>(
      `${endpoints.mapeador}/${id}`,
      data
    );
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`${endpoints.mapeador}/${id}`);
  },

  async getById(id: string) {
    const response = await api.get<MapeadorWithHistorico>(
      `${endpoints.mapeador}/${id}`
    );
    return response.data;
  },
};
