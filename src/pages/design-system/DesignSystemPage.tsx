import React, { useState } from 'react';
import styles from './DesignSystemPage.module.css';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { Card } from '../../components/shared/Card';
import { Icon } from '../../components/shared/Icon';
import { InputField } from '../../components/shared/Input';
import { Modal } from '../../components/shared/Modal';

const DesignSystemPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const colors = [
    { name: 'Red Dark', var: 'var(--color-red-dark)' },
    { name: 'Red Primary', var: 'var(--color-red-primary)' },
    { name: 'Red Secondary', var: 'var(--color-red-secondary)' },
    { name: 'Red Border', var: 'var(--color-red-border)' },
    { name: 'Red BG', var: 'var(--color-red-bg)' },
    
    { name: 'Blue Dark', var: 'var(--color-blue-dark)' },
    { name: 'Blue Primary', var: 'var(--color-blue-primary)' },
    { name: 'Blue Secondary', var: 'var(--color-blue-secondary)' },
    { name: 'Blue Border', var: 'var(--color-blue-border)' },
    { name: 'Blue BG', var: 'var(--color-blue-bg)' },
    
    { name: 'Green Dark', var: 'var(--color-green-dark)' },
    { name: 'Green Primary', var: 'var(--color-green-primary)' },
    { name: 'Green Secondary', var: 'var(--color-green-secondary)' },
    { name: 'Green Border', var: 'var(--color-green-border)' },
    { name: 'Green BG', var: 'var(--color-green-bg)' },
    
    { name: 'Yellow Dark', var: 'var(--color-yellow-dark)' },
    { name: 'Yellow Primary', var: 'var(--color-yellow-primary)' },
    { name: 'Yellow Secondary', var: 'var(--color-yellow-secondary)' },
    { name: 'Yellow Border', var: 'var(--color-yellow-border)' },
    { name: 'Yellow BG', var: 'var(--color-yellow-bg)' },
    
    { name: 'Neutral Dark', var: 'var(--color-neutral-dark)' },
    { name: 'Neutral Primary', var: 'var(--color-neutral-primary)' },
    { name: 'Neutral Secondary', var: 'var(--color-neutral-secondary)' },
    { name: 'Neutral Border', var: 'var(--color-neutral-border)' },
    { name: 'Neutral BG', var: 'var(--color-neutral-bg)' },
  ];

  const typography = [
    { size: 'var(--text-h1)', label: 'h1' },
    { size: 'var(--text-h2)', label: 'h2' },
    { size: 'var(--text-h3)', label: 'h3' },
    { size: 'var(--text-p)', label: 'p' },
    { size: 'var(--text-small)', label: 'small' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title} style={{ fontSize: 'var(--text-h1)' }}>Design System Showcase</h1>
        <p className={styles.subtitle} style={{ fontSize: 'var(--text-p)' }}>
          Tổng hợp các Component dùng chung và Design Tokens (Colors, Typography, Spacing).
        </p>
      </div>

      {/* Colors Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle} style={{ fontSize: 'var(--text-h2)' }}>Colors & Tokens (Google Palette)</h2>
        <div className={styles.grid}>
          {colors.map((color) => (
            <div key={color.name} className={styles.colorCard}>
              <div 
                className={styles.colorSwatch} 
                style={{ backgroundColor: color.var }} 
              />
              <div className={styles.colorInfo}>
                <span className={styles.colorName}>{color.name}</span>
                <span className={styles.colorValue}>{color.var}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle} style={{ fontSize: 'var(--text-h2)' }}>Typography</h2>
        <div className={styles.section}>
          {typography.map((type) => (
            <div key={type.label} className={styles.fontRow}>
              <span className={styles.fontLabel}>{type.label}</span>
              <span style={{ 
                fontSize: type.size, 
                fontWeight: ['h1', 'h2', 'h3'].includes(type.label) ? 'var(--weight-bold)' : 'var(--weight-regular)' 
              }}>
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Font Weights Showcase Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle} style={{ fontSize: 'var(--text-h2)' }}>Font Weights (One Source of Truth)</h2>
        <div className={styles.flexRow} style={{ gap: 'var(--space-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>var(--weight-regular) / 400</span>
            <span style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-regular)' }}>Regular Text</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>var(--weight-bold) / 800</span>
            <span style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-bold)' }}>Bold Title</span>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle} style={{ fontSize: 'var(--text-h2)' }}>Buttons (3D Solid Shadow)</h2>
        
        {/* Colors */}
        <div className={styles.flexRow}>
          <Button color="blue" label="Blue" />
          <Button color="green" label="Green" />
          <Button color="red" label="Red" />
          <Button color="yellow" label="Yellow" />
          <Button color="neutral" variant="outline" label="Grey Outline" />
        </div>

        {/* Variants */}
        <div className={styles.flexRow}>
          <Button color="blue" variant="primary" label="Primary" />
          <Button color="blue" variant="outline" label="Outline" />
        </div>
        
        {/* Sizes */}
        <div className={styles.flexRow}>
          <Button color="green" size="sm" label="Small" />
          <Button color="green" size="md" label="Medium" />
          <Button color="green" size="lg" label="Large" />
        </div>

        {/* State */}
        <div className={styles.flexRow}>
          <Button color="red" disabled label="Disabled" />
          <Button color="red" variant="outline" disabled label="Disabled" />
        </div>

        {/* Icons */}
        <div className={styles.flexRow}>
          <Button color="blue" variant="primary" icon="add" label="Solid Icon" />
          <Button color="green" variant="primary" icon="check" iconPosition="right" label="Solid Right" />
          <Button color="neutral" variant="outline" icon="add" label="Outline Icon" />
          <Button color="neutral" variant="outline" icon="arrow_forward" iconPosition="right" label="Outline Right" />
          <Button color="neutral" variant="outline" icon="close" iconOnly />
          <Button color="red" variant="primary" icon="delete" iconOnly />
        </div>
      </section>

      {/* Badges Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Badges</h2>
        <div className={styles.flexRow}>
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>

      {/* Inputs Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Inputs & Forms</h2>
        <div className={styles.grid}>
          <InputField 
            label="Standard Input" 
            placeholder="Type here..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <InputField 
            label="Input with Error" 
            placeholder="Error state" 
            error="This field is required"
          />
          <InputField 
            label="With Icons" 
            placeholder="Search..." 
            leftIcon="search"
            rightIcon="mic"
          />
        </div>
      </section>

      {/* Icons Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Icons (Material Symbols)</h2>
        <div className={styles.flexRow}>
          <Icon name="home" />
          <Icon name="favorite" filled style={{ color: 'var(--color-danger)' }} />
          <Icon name="settings" />
          <Icon name="account_circle" size="lg" />
          <Icon name="check_circle" size="sm" filled style={{ color: 'var(--color-success)' }} />
        </div>
      </section>

      {/* Cards & Modals Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cards & Modals</h2>
        <div className={styles.flexRow}>
          <div className={styles.cardPreview}>
            <Card hoverable padding="lg">
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Example Card</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                This is a standard card component with hover effect enabled.
                It uses the global radius and border tokens.
              </p>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="primary" size="sm">Action</Button>
              </div>
            </Card>
          </div>
          
          <Card padding="md">
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Test Modal</h3>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              Open Demo Modal
            </Button>
          </Card>
        </div>
      </section>

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Design System Modal"
        footer={
          <>
            <Button color="neutral" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p>This is a standard modal component used throughout the application.</p>
        <p style={{ marginTop: 'var(--space-2)' }}>It features a consistent header, body padding, and footer actions layout.</p>
      </Modal>
    </div>
  );
};

export default DesignSystemPage;
