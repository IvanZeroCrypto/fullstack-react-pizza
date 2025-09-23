interface IInputProps {
  text: string;
  type?: string;
  value: string;
  onChange: (e: any) => void;
}

const Input = ({ text, value, type, onChange, ...props }: IInputProps) => {
  return (
    <label>
      <h3 className="text-sm mb-[2px] font-medium">{text}:</h3>
      <input
        value={value}
        type={type}
        onChange={onChange}
        className="border border-[#EFEFEF] w-full px-5 py-2 rounded-xl  "
        {...props}
      />
    </label>
  );
};

export default Input;
