export default function Input({
    label = "",
    id = 0,
    typeHtml = "text",
    style = {},
    onChange = () => {},
    value = "",
    error = false,
    labelError = ""
}) {
    return (
        <div style={style} className="input__component">
            {label.length > 0 && <label htmlFor={id}>{label}</label>}
            <input id={id || ""} type={typeHtml} onChange={onChange} value={value} />
            {error && <p>{labelError}</p>}
        </div>
    )
}
