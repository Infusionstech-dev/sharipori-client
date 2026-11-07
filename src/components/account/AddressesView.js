"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Skeleton from "@/components/ui/Skeleton";
import Textarea from "@/components/ui/Textarea";
import { BD_DISTRICTS, findDistrict } from "@/data/bd-locations";
import { applyServerErrors, serverMessage } from "@/lib/authForms";
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSetDefaultAddressMutation,
  useUpdateAddressMutation,
} from "@/store/api/accountApi";
import { LoadError, PageTitle } from "./States";

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter the receiver's name").max(100),
    phone: z
      .string()
      .trim()
      .regex(/^01[3-9]\d{8}$/, "Enter a valid phone number like 01XXXXXXXXX"),
    district: z.string().min(1, "Choose a district"),
    thana: z.string().min(1, "Choose a thana or upazila"),
    addressLine: z.string().trim().min(5, "Enter house, road and area").max(255),
    isDefault: z.boolean(),
  })
  .refine((value) => findDistrict(value.district)?.thanas.some((t) => t.en === value.thana), {
    path: ["thana"],
    message: "Choose a thana or upazila",
  });

const DISTRICT_OPTIONS = BD_DISTRICTS.map((d) => ({ value: d.en, label: `${d.en} (${d.bn})` }));

function AddressModal({ address, onClose }) {
  const [createAddress, creating] = useCreateAddressMutation();
  const [updateAddress, updating] = useUpdateAddressMutation();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: address?.name ?? "",
      phone: address?.phone ?? "",
      district: address?.district ?? "",
      thana: address?.thana ?? "",
      addressLine: address?.addressLine ?? "",
      isDefault: address?.isDefault ?? false,
    },
  });
  const district = useWatch({ control, name: "district" });
  const thanas = findDistrict(district)?.thanas ?? [];

  const onSubmit = async (values) => {
    try {
      if (address) {
        await updateAddress({ id: address.id, ...values }).unwrap();
      } else {
        await createAddress(values).unwrap();
      }
      toast.success("Address saved");
      onClose();
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        toast.error(serverMessage(error, "Could not save this address."));
      }
    }
  };

  return (
    <Modal open onClose={onClose} title={address ? "Edit address" : "Add address"}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          label="Receiver's name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Phone"
          type="tel"
          inputMode="numeric"
          placeholder="01XXXXXXXXX"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Select
          label="District"
          placeholder="Choose a district"
          options={DISTRICT_OPTIONS}
          error={errors.district?.message}
          {...register("district", { onChange: () => setValue("thana", "") })}
        />
        <Select
          label="Thana / Upazila"
          placeholder={thanas.length ? "Choose your area" : "Choose a district first"}
          disabled={!thanas.length}
          options={thanas.map((t) => ({ value: t.en, label: `${t.en} (${t.bn})` }))}
          error={errors.thana?.message}
          {...register("thana")}
        />
        <Textarea
          label="Address"
          rows={2}
          placeholder="House, road, area and any landmark"
          error={errors.addressLine?.message}
          {...register("addressLine")}
        />
        {!address?.isDefault && (
          <Checkbox label="Use as my default address" {...register("isDefault")} />
        )}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={creating.isLoading || updating.isLoading}
        >
          Save address
        </Button>
      </form>
    </Modal>
  );
}

function AddressCard({ address, onEdit }) {
  const [setDefault, settingDefault] = useSetDefaultAddressMutation();
  const [deleteAddress, deleting] = useDeleteAddressMutation();
  const [confirming, setConfirming] = useState(false);

  const run = async (action, message) => {
    try {
      await action.unwrap();
      toast.success(message);
    } catch (error) {
      toast.error(serverMessage(error, "Something went wrong. Please try again."));
    }
  };

  return (
    <li className="flex flex-col rounded-lg bg-white p-4 ring-1 ring-soft">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-medium">{address.name}</p>
        {address.isDefault && <Badge variant="primary">Default</Badge>}
      </div>
      <address className="flex-1 text-sm not-italic leading-relaxed text-text/80">
        {address.phone}
        <br />
        {address.addressLine}
        <br />
        {address.thana}, {address.district}
      </address>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(address)}>
          Edit
        </Button>
        {!address.isDefault && (
          <Button
            size="sm"
            variant="ghost"
            loading={settingDefault.isLoading}
            onClick={() => run(setDefault(address.id), "Default address updated")}
          >
            Set as default
          </Button>
        )}
        {confirming ? (
          <>
            <Button
              size="sm"
              className="bg-red-700 hover:bg-red-800"
              loading={deleting.isLoading}
              onClick={() => run(deleteAddress(address.id), "Address deleted")}
            >
              Confirm delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Keep
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setConfirming(true)}>
            Delete
          </Button>
        )}
      </div>
    </li>
  );
}

export default function AddressesView() {
  const { data, isLoading, isError, refetch } = useGetAddressesQuery();
  // undefined: closed, null: adding, an address: editing it.
  const [editing, setEditing] = useState(undefined);

  let content;
  if (isLoading) {
    content = <Skeleton className="h-40" />;
  } else if (isError) {
    content = <LoadError what="addresses" onRetry={refetch} />;
  } else if (!data.length) {
    content = (
      <EmptyState
        icon={<MapPin className="size-8 text-primary" aria-hidden="true" />}
        title="No saved addresses"
        description="Save an address to check out faster."
        action={<Button onClick={() => setEditing(null)}>Add address</Button>}
      />
    );
  } else {
    content = (
      <ul className="grid gap-3 sm:grid-cols-2">
        {data.map((address) => (
          <AddressCard key={address.id} address={address} onEdit={setEditing} />
        ))}
      </ul>
    );
  }

  return (
    <div>
      <PageTitle
        action={
          data?.length > 0 && (
            <Button variant="outline" onClick={() => setEditing(null)}>
              <Plus className="size-4" aria-hidden="true" />
              Add address
            </Button>
          )
        }
      >
        My addresses
      </PageTitle>
      {content}
      {editing !== undefined && (
        <AddressModal address={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
