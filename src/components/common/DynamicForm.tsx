import React from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { ButtonComponent } from "./Button";

interface FormAttribute {
  type: "text" | "number" | "select" | "textarea" | "email" | "url" | "tel" | "password" | "date" | "image" | "lq-image" | "list";
  name: string;
  label: string;
  placeholder?: string;
  default?: any;
  required?: boolean;
  validation?: {
    type: "email" | "url" | "min" | "max" | "minLength" | "maxLength" | "pattern" | "custom";
    value?: any;
    message?: string;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  }[];
  condition?: {
    item: string;
    if: string | string[];
    then: string;
    else: string;
  };
  selectApi?: string | Array<{ id: string; value: string }>;
  apiType?: "CSV" | "JSON";
  radioButton?: boolean;
  showItem?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  listView?: boolean;
  customClass?: string;
  arrayOut?: boolean;
  search?: boolean;
  filter?: boolean;
  ratio?: number;
  width?: number;
  height?: number;
  demo?: number;
  limit?: number;
  excludeLiquid?: boolean;
  liquidMarker?: string;
  onChange?: (name: string, value: any) => any;
}

interface DynamicFormProps {
  attributes: FormAttribute[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  header: string;
  description?: string;
  submitText?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ attributes, onSubmit, onClose, header, description, submitText = "Submit" }) => {
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<Record<string, any>>({
    defaultValues: attributes.reduce(
      (acc, attr) => ({
        ...acc,
        [attr.name]: attr.default || "",
      }),
      {}
    ),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const watchedValues = watch();

  // Trigger validation on field change
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && type === "change") {
        trigger(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getValidationRules = (attribute: FormAttribute) => {
    const rules: any = {};

    if (attribute.required) {
      rules.required = `${attribute.label} is required`;
    }

    // Add built-in validation based on field type
    switch (attribute.type) {
      case "email":
        rules.pattern = {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        };
        break;
      case "url":
        rules.pattern = {
          value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          message: "Invalid URL",
        };
        break;
      case "tel":
        rules.pattern = {
          value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
          message: "Invalid phone number",
        };
        break;
      case "number":
        if (attribute.min !== undefined) {
          rules.min = {
            value: attribute.min,
            message: `Minimum value is ${attribute.min}`,
          };
        }
        if (attribute.max !== undefined) {
          rules.max = {
            value: attribute.max,
            message: `Maximum value is ${attribute.max}`,
          };
        }
        break;
      case "image":
      case "lq-image":
        rules.validate = {
          aspectRatio: (value: string) => {
            if (!value) return true;
            // Add aspect ratio validation if needed
            return true;
          },
        };
        break;
    }

    // Add length validation if specified
    if (attribute.minLength) {
      rules.minLength = {
        value: attribute.minLength,
        message: `Minimum length is ${attribute.minLength} characters`,
      };
    }
    if (attribute.maxLength) {
      rules.maxLength = {
        value: attribute.maxLength,
        message: `Maximum length is ${attribute.maxLength} characters`,
      };
    }

    // Add custom validations
    if (attribute.validation) {
      attribute.validation.forEach((validation) => {
        switch (validation.type) {
          case "pattern":
            if (validation.pattern) {
              rules.pattern = {
                value: new RegExp(validation.pattern),
                message: validation.message || "Invalid format",
              };
            }
            break;
          case "custom":
            if (validation.custom) {
              rules.validate = validation.custom;
            }
            break;
        }
      });
    }

    return rules;
  };

  const isFieldEnabled = (condition?: FormAttribute["condition"]) => {
    if (!condition) return true;

    const watchedValue = watchedValues[condition.item];
    if (Array.isArray(condition.if)) {
      return condition.if.includes(watchedValue) ? condition.then === "enabled" : condition.else === "enabled";
    }
    return watchedValue === condition.if ? condition.then === "enabled" : condition.else === "enabled";
  };

  const renderField = (attribute: FormAttribute) => {
    if (!isFieldEnabled(attribute.condition)) return null;

    const validationRules = getValidationRules(attribute);
    const error = errors[attribute.name];

    const commonClasses = `border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"} ${attribute.customClass || ""}`;

    switch (attribute.type) {
      case "select":
        return (
          <Controller
            name={attribute.name}
            control={control}
            rules={validationRules}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
                {attribute.radioButton ? (
                  <div className="flex gap-4">
                    {attribute.apiType === "CSV"
                      ? attribute.selectApi
                          ?.toString()
                          .split(",")
                          .map((option) => (
                            <label key={option} className="flex items-center">
                              <input type="radio" {...field} value={option} checked={field.value === option} className="mr-2" />
                              <span>{option}</span>
                            </label>
                          ))
                      : Array.isArray(attribute.selectApi) &&
                        attribute.selectApi.map((option) => (
                          <label key={option.id} className="flex items-center">
                            <input type="radio" {...field} value={option.id} checked={field.value === option.id} className="mr-2" />
                            <span>{option.value}</span>
                          </label>
                        ))}
                  </div>
                ) : (
                  <select
                    {...field}
                    className={commonClasses}
                    onChange={(e) => {
                      field.onChange(e);
                      if (attribute.onChange) {
                        const value = attribute.onChange(attribute.name, {
                          ...field.value,
                          ratioArray: attribute.apiType === "JSON" && Array.isArray(attribute.selectApi) ? attribute.selectApi.find((opt) => opt.id === e.target.value) : null,
                        });
                        field.onChange(value);
                      }
                    }}
                  >
                    <option value="">Select {attribute.label}</option>
                    {attribute.apiType === "CSV"
                      ? attribute.selectApi
                          ?.toString()
                          .split(",")
                          .map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))
                      : Array.isArray(attribute.selectApi) &&
                        attribute.selectApi.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.value}
                          </option>
                        ))}
                  </select>
                )}
                {error && <span className="text-xs text-red-500">{error.message as string}</span>}
              </div>
            )}
          />
        );

      case "image":
      case "lq-image":
        return (
          <Controller
            name={attribute.name}
            control={control}
            rules={validationRules}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Handle file upload logic here
                        field.onChange(file);
                      }
                    }}
                    className={commonClasses}
                  />
                  {field.value && <img src={typeof field.value === "string" ? field.value : URL.createObjectURL(field.value)} alt="Preview" className="w-16 h-16 object-cover rounded" />}
                </div>
                {error && <span className="text-xs text-red-500">{error.message as string}</span>}
              </div>
            )}
          />
        );

      case "list":
        return (
          <Controller
            name={attribute.name}
            control={control}
            rules={validationRules}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={attribute.limit}
                    placeholder="Demo count"
                    value={attribute.demo || 1}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        field.onChange({ ...field.value, demo: value });
                      }
                    }}
                    className={`w-24 ${commonClasses}`}
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Max limit"
                    value={attribute.limit || 1}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        field.onChange({ ...field.value, limit: value });
                      }
                    }}
                    className={`w-24 ${commonClasses}`}
                  />
                </div>
                {error && <span className="text-xs text-red-500">{error.message as string}</span>}
              </div>
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={attribute.name}
            control={control}
            rules={validationRules}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
                <textarea {...field} rows={attribute.rows || 3} placeholder={attribute.placeholder} className={commonClasses} />
                {error && <span className="text-xs text-red-500">{error.message as string}</span>}
              </div>
            )}
          />
        );

      case "number":
        return (
          <Controller
            name={attribute.name}
            control={control}
            rules={validationRules}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
                <input type="number" {...field} min={attribute.min} max={attribute.max} step={attribute.step} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder={attribute.placeholder} className={commonClasses} />
                {error && <span className="text-xs text-red-500">{error.message as string}</span>}
              </div>
            )}
          />
        );

      case "date":
        return (
          <Controller
            name={attribute.name}
            control={control}
            rules={validationRules}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
                <input type="date" {...field} placeholder={attribute.placeholder} className={commonClasses} />
                {error && <span className="text-xs text-red-500">{error.message as string}</span>}
              </div>
            )}
          />
        );

      case "email":
      case "url":
      case "tel":
      case "password":
      case "text":
      default:
        return (
          <Controller
            name={attribute.name}
            control={control}
            rules={validationRules}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{attribute.label}</label>
                <input type={attribute.type} {...field} placeholder={attribute.placeholder} minLength={attribute.minLength} maxLength={attribute.maxLength} className={commonClasses} />
                {error && <span className="text-xs text-red-500">{error.message as string}</span>}
              </div>
            )}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{header}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {description && <div className="px-4 py-2 text-sm text-gray-600">{description}</div>}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
          {attributes.map((attribute) => (
            <div key={attribute.name}>{renderField(attribute)}</div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <ButtonComponent colorScheme="secondary" onClick={onClose} title="Cancel" disabled={isSubmitting} />
            <ButtonComponent colorScheme="primary" title={isSubmitting ? "Submitting..." : submitText} disabled={!isValid || !isDirty || isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
