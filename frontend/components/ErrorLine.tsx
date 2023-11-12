interface Props {
    message: string;
}
const ErrorLine = ({ message }: Props) => (
    <div className="mt-2 max-w-xl text-sm text-red-500">
        <p>{message}</p>
    </div>
);

export default ErrorLine;