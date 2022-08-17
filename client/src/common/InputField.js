import React from 'react';

export function InputField(props) {
    // podporovan� typy pro element input
    const INPUTS = ['text', 'number', 'date','Boolean'];

    // validace elementu a typu
    const type = props.type.toLowerCase();
    const isTextarea = (type === 'textarea');
    const required = props.required || false;

    if (!isTextarea && !INPUTS.includes(type)) {
        return null;
    }

    // p�i�azen� hodnoty minima do atributu p��slu�n�ho typu
    const minProp = props.min || null;
    const min = ['number', 'date'].includes(type) ? minProp : null;
    const minlength = ['text', 'textarea'].includes(type) ? minProp : null;

    return (
        <div className="form-group">
            <label>{props.label}:</label>

            {/* vykreslen� aktu�ln�ho elementu */}
            {isTextarea
                ? <textarea required={required} className="form-control" placeholder={props.prompt} rows={props.rows}
                    minLength={minlength} name={props.name} value={props.value || ""} onChange={props.handleChange} />
                : <input required={required} type={type} className="form-control" placeholder={props.prompt}
                    minLength={minlength} min={min} name={props.name} value={props.value || ""} onChange={props.handleChange} />}

        </div>
    );
}

export default InputField;