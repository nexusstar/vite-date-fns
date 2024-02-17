import React, { useState } from "react";
import { Locale, format } from "date-fns";
// import { loadLocale } from "./utils/loadLocale";
import locale from "./utils/external/local/index.mjs";

export const DateInput: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [localeCode, setLocaleCode] = useState<string>("en-US");
  const [formattedDate, setFormattedDate] = useState<string>("");

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = event.target.value;
    setDate(inputDate);

    if (inputDate) {
      setLocaleCode(process.env.APP_LOCALE || "en-US");
      // const localeData = await loadLocale(localeCode);
      const formatted = format(new Date(inputDate), "PP", {
        locale: locale as Locale,
      });
      setFormattedDate(formatted);
    } else {
      setFormattedDate("");
    }
  };

  return (
    <>
      <p>Select a date to see format</p>
      <input
        className="date-input"
        type="date"
        value={date}
        onChange={handleChange}
      />
      <p>Formatted Date: {formattedDate}</p>
      {localeCode && <p>Locale applied: {localeCode}</p>}
    </>
  );
};
