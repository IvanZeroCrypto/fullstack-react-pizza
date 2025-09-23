import { FC } from "react";
import { useFormContext } from "react-hook-form";
import ErrorText from "../errortext/ErrorText";
import { MdClear } from "react-icons/md";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  title?: string;
}

const FormInput: FC<Props> = ({ name, title, ...props }) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <label>
      <h3 className="text-sm mb-[2px] font-medium">{title}:</h3>
      <div className="relative">
        <input
          {...register(name)}
          {...props}
          className="border border-[#EFEFEF] w-full px-5 py-2 rounded-xl  "
        />
        {value && (
          <div>
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-3 font-extrabold"
              onClick={onClickClear}
            >
              <MdClear />
            </button>
          </div>
        )}
      </div>
      {errorText && <ErrorText text={errorText} />}
    </label>
  );
};

export default FormInput;
