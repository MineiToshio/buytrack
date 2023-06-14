"use client";

import Typography from "@/components/core/Typography";
import Button from "@/core/Button";
import Icons from "@/core/Icons";
import Input from "@/core/Input";
import {
  CREATE_COUNTRY,
  CREATE_PRODUCTS_COUNTRY,
  CREATE_PRODUCT_TYPE,
  GET_COUNTRY,
  GET_PRODUCTS_COUNTRY,
  GET_PRODUCT_TYPE,
} from "@/helpers/apiUrls";
import { storeTypeOptions } from "@/helpers/constants";
import useSelect from "@/hooks/useAddSelect";
import { StoreFull } from "@/types/prisma";
import {
  Country,
  ProductType,
  ProductsCountry,
  StoreType,
} from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import StoreFormRow from "./StoreFormRow";

const YES_NO_OPTIONS = [
  {
    value: true,
    label: "Si",
  },
  {
    value: false,
    label: "No",
  },
];

export type StoreFormType = {
  name: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  hasStock?: boolean;
  receiveOrders?: boolean;
  countryId: string;
  type: StoreType;
  productsCountryIds?: string[];
  productTypeIds?: string[];
};

type StoreFormProps = {
  onSubmit: (data: StoreFormType) => void;
  isLoading?: boolean;
  store?: StoreFull | null;
};

const StoreForm: FC<StoreFormProps> = ({ isLoading, store, onSubmit }) => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(!!store);

  const { options: countryOptions, addNewOption: addNewCountry } =
    useSelect<Country>(GET_COUNTRY, CREATE_COUNTRY, ["country"]);

  const {
    options: productsCountryOptions,
    addNewOption: addNewProductsCountry,
  } = useSelect<ProductsCountry>(
    GET_PRODUCTS_COUNTRY,
    CREATE_PRODUCTS_COUNTRY,
    ["products-country"]
  );

  const { options: productTypeOptions, addNewOption: addNewProductType } =
    useSelect<ProductType>(GET_PRODUCT_TYPE, CREATE_PRODUCT_TYPE, [
      "product-type",
    ]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StoreFormType>();

  useEffect(() => {
    if (store) {
      setValue("name", store.name);
      setValue("countryId", store.countryId);
      setValue("type", store.type);
      store.whatsapp && setValue("whatsapp", store.whatsapp);
      store.facebook && setValue("facebook", store.facebook);
      store.instagram && setValue("instagram", store.instagram);
      store.website && setValue("website", store.website);
      store.hasStock && setValue("hasStock", store.hasStock);
      store.receiveOrders && setValue("receiveOrders", store.receiveOrders);
      store.productTypes &&
        setValue(
          "productTypeIds",
          store.productTypes.map((pt) => pt.productType.id)
        );
      store.productsCountry &&
        setValue(
          "productsCountryIds",
          store.productsCountry.map((pc) => pc.country.id)
        );
    }
  }, [setValue, store]);

  return (
    <form className="flex w-full flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Input
          variant="unstyled"
          placeholder="Sin nombre"
          className="text-lg font-semibold sm:text-3xl"
          readOnly={isReadOnly}
          {...register("name", { required: true })}
        />
        {errors.name && (
          <Typography className="mt-1 text-error" size="xs">
            El nombre es obligatorio
          </Typography>
        )}
      </div>
      <StoreFormRow
        title="Tipo"
        Icon={Icons.ChevronSquareDown}
        placeholder="Negocio o persona"
        type="select"
        options={storeTypeOptions}
        control={control}
        formField="type"
        readOnly={isReadOnly}
      />
      <StoreFormRow
        title="Tipos de producto"
        Icon={Icons.Category}
        placeholder="Elige los tipo de productos en venta"
        type="select"
        options={productTypeOptions}
        control={control}
        formField="productTypeIds"
        newModalTitle="Nuevo tipo de producto"
        onAdd={addNewProductType}
        multiple
        required
        error={!!errors.productTypeIds}
        errorMessage="El tipo de producto es obligatorio"
        readOnly={isReadOnly}
      />
      <StoreFormRow
        title="Países de importación"
        Icon={Icons.CornerUpLeftArrow}
        placeholder="Elige los países de importación"
        type="select"
        options={productsCountryOptions}
        control={control}
        formField="productsCountryIds"
        newModalTitle="Nuevo país de importación"
        onAdd={addNewProductsCountry}
        multiple
        readOnly={isReadOnly}
      />
      <StoreFormRow
        title="País"
        Icon={Icons.Globe}
        placeholder="Elige el país de la tienda"
        type="select"
        options={countryOptions}
        control={control}
        formField="countryId"
        newModalTitle="Nuevo país"
        onAdd={addNewCountry}
        required
        error={!!errors.countryId}
        errorMessage="El país de la tienda es obligatorio"
        readOnly={isReadOnly}
      />
      <StoreFormRow
        title="Whatsapp"
        Icon={Icons.Message}
        placeholder="987 654 321"
        type="input"
        readOnly={isReadOnly}
        {...register("whatsapp")}
      />
      <StoreFormRow
        title="Facebook"
        Icon={Icons.Facebook}
        placeholder="https://fb.com/misitio"
        type="input"
        readOnly={isReadOnly}
        {...register("facebook")}
      />
      <StoreFormRow
        title="Instagram"
        Icon={Icons.Instagram}
        placeholder="https://instagram.com/misitio"
        type="input"
        readOnly={isReadOnly}
        {...register("instagram")}
      />
      <StoreFormRow
        title="Website"
        Icon={Icons.Web}
        placeholder="https://misitio.com"
        type="input"
        readOnly={isReadOnly}
        {...register("website")}
      />
      <StoreFormRow
        title="Tiene stock"
        Icon={Icons.ChevronSquareDown}
        placeholder="si o no"
        type="select"
        options={YES_NO_OPTIONS}
        control={control}
        formField="hasStock"
        readOnly={isReadOnly}
      />
      <StoreFormRow
        title="Recibe órdenes"
        Icon={Icons.ChevronSquareDown}
        placeholder="si o no"
        type="select"
        options={YES_NO_OPTIONS}
        control={control}
        formField="receiveOrders"
        readOnly={isReadOnly}
      />
      {!isReadOnly && (
        <Button type="submit" className="mt-5 w-fit" isLoading={isLoading}>
          Guardar
        </Button>
      )}
    </form>
  );
};

export default StoreForm;
