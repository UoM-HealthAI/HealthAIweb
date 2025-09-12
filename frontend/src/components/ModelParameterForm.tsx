/**
 * Reusable Parameter Form Component
 * Automatically generates parameter inputs based on model configuration
 */

import React from 'react';
import { ModelParameter } from '../config/modelConfig';

interface ModelParameterFormProps {
  parameters: ModelParameter[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export const ModelParameterForm: React.FC<ModelParameterFormProps> = ({
  parameters,
  values,
  onChange
}) => {
  const handleParameterChange = (param: ModelParameter, value: any) => {
    let processedValue = value;
    
    if (param.type === 'number') {
      processedValue = param.step ? parseFloat(value) : parseInt(value);
    }
    
    onChange(param.name, processedValue);
  };

  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
      {parameters.map((param) => (
        <div key={param.name} style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '1rem',
          background: '#f8f9fa'
        }}>
          <label style={{display: 'block', marginBottom: '0.5rem'}}>
            <strong>{param.label}</strong>
            <span style={{color: '#666', fontSize: '0.9rem', display: 'block'}}>
              {param.description}
            </span>
          </label>
          
          {param.type === 'number' && (
            <input
              type="number"
              value={values[param.name] || param.defaultValue}
              onChange={(e) => handleParameterChange(param, e.target.value)}
              min={param.min}
              max={param.max}
              step={param.step}
              className="form-control"
              style={{fontSize: '1.1rem', padding: '0.75rem'}}
            />
          )}
          
          {param.type === 'select' && param.options && (
            <select
              value={values[param.name] || param.defaultValue}
              onChange={(e) => handleParameterChange(param, e.target.value)}
              className="form-control"
              style={{fontSize: '1.1rem', padding: '0.75rem'}}
            >
              {param.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
          
          {param.type === 'boolean' && (
            <input
              type="checkbox"
              checked={values[param.name] || param.defaultValue}
              onChange={(e) => handleParameterChange(param, e.target.checked)}
              style={{marginRight: '0.5rem'}}
            />
          )}
          
          <small style={{color: '#666', fontSize: '0.8rem'}}>
            {param.helpText}
          </small>
        </div>
      ))}
    </div>
  );
};
