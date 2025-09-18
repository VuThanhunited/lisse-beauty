import React from 'react';
import styles from './ResponsiveContainer.module.css';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '1200px',
  padding = 'default' 
}) => {
  const containerClass = `${styles.container} ${styles[`padding-${padding}`]} ${className}`;
  
  return (
    <div 
      className={containerClass}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;