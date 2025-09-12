/**
 * Reusable Results Display Component
 * Automatically displays results based on model configuration
 */

import React from 'react';
import { ModelConfig } from '../config/modelConfig';

interface ModelResultsDisplayProps {
  modelConfig: ModelConfig;
  visualizations: Record<string, string>;
  dataFiles: Record<string, string>;
  onDownload: (filePath: string, filename: string) => void;
}

const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith('http')) return path;
  return `${window.location.origin}/${path}`;
};

export const ModelResultsDisplay: React.FC<ModelResultsDisplayProps> = ({
  modelConfig,
  visualizations,
  dataFiles,
  onDownload
}) => {
  return (
    <>
      {/* Visualizations Section */}
      {Object.keys(visualizations).length > 0 && (
        <div className="card">
          <h3 style={{color: '#495057', marginBottom: '1rem'}}>Data Visualizations</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            {modelConfig.visualizations.map((vizConfig) => {
              const filePath = visualizations[vizConfig.key];
              if (!filePath) return null;
              
              return (
                <div key={vizConfig.key} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: '#f8f9fa'
                }}>
                  <h4 style={{color: '#007bff', marginBottom: '1rem'}}>{vizConfig.title}</h4>
                  <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                    <img 
                      src={toAbsoluteUrl(filePath)}
                      alt={vizConfig.title}
                      style={{
                        width: '100%', 
                        maxWidth: '400px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <p style={{
                      color: '#6c757d',
                      fontSize: '0.9rem',
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      {vizConfig.description}
                    </p>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onDownload(filePath, `${vizConfig.key}${vizConfig.fileExtension}`)}
                    style={{width: '100%'}}
                  >
                    Download {vizConfig.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Files Section */}
      {Object.keys(dataFiles).length > 0 && (
        <div className="card">
          <h3 style={{color: '#495057', marginBottom: '1rem'}}>Download Processed Data</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
            {modelConfig.dataFiles.map((fileConfig) => {
              const filePath = dataFiles[fileConfig.key];
              if (!filePath) return null;
              
              return (
                <div key={fileConfig.key} style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: '#f8f9fa'
                }}>
                  <h4 style={{color: '#28a745', marginBottom: '0.5rem'}}>{fileConfig.title}</h4>
                  <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                    {fileConfig.description}
                  </p>
                  <div style={{fontSize: '0.8rem', color: '#999', marginBottom: '1rem'}}>
                    <small>{fileConfig.helpText}</small>
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={() => onDownload(filePath, `${fileConfig.key}${fileConfig.fileExtension}`)}
                    style={{width: '100%'}}
                  >
                    Download {fileConfig.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
