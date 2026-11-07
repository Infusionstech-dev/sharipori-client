"use client";

import { useId } from "react";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { controlClass } from "@/components/ui/Field";
import { BD_DISTRICTS, findDistrict } from "@/data/bd-locations";
import Section from "./Section";

// Saved address cards need an addresses API, which arrives with the account pages.
export default function AddressSection({ register, errors, district, loggedIn, onDistrictChange }) {
  const listId = useId();
  const districtField = register("district", {
    onChange: (event) => onDistrictChange(event.target.value),
  });
  const thanas = findDistrict(district)?.thanas ?? [];

  return (
    <Section step={2} title="Delivery address">
      {/* A text box with suggestions: type a few letters to find a district quickly on a phone. */}
      <Input
        label="District *"
        list={listId}
        autoComplete="off"
        placeholder="Start typing, for example Dhaka"
        error={errors.district?.message}
        {...districtField}
      />
      <datalist id={listId}>
        {BD_DISTRICTS.map((item) => (
          <option key={item.en} value={item.en}>
            {item.bn}
          </option>
        ))}
      </datalist>

      <Select
        label="Thana / Upazila *"
        placeholder={thanas.length ? "Choose your area" : "Choose a district first"}
        disabled={!thanas.length}
        options={thanas.map((thana) => ({ value: thana.en, label: `${thana.en} (${thana.bn})` }))}
        error={errors.thana?.message}
        className={controlClass}
        {...register("thana")}
      />

      <Textarea
        label="Address *"
        rows={2}
        autoComplete="street-address"
        placeholder="House, road, area and any landmark"
        error={errors.addressLine?.message}
        {...register("addressLine")}
      />
      <Input label="Note for the delivery (optional)" {...register("note")} />

      {loggedIn && (
        <Checkbox label="Save this address to my account" {...register("saveAddress")} />
      )}
    </Section>
  );
}
