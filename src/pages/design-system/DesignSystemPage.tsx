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
    { name: 'Background', var: 'var(--color-bg)' },
    { name: 'Surface', var: 'var(--color-surface)' },
    { name: 'Border', var: 'var(--color-border)' },
    { name: 'Primary Text', var: 'var(--color-text-primary)' },
    { name: 'Secondary Text', var: 'var(--color-text-secondary)' },
    { name: 'Accent', var: 'var(--color-accent)' },
    { name: 'Accent Soft', var: 'var(--color-accent-soft)' },
    { name: 'Success', var: 'var(--color-success)' },
    { name: 'Warning', var: 'var(--color-warning)' },
    { name: 'Danger', var: 'var(--color-danger)' },
  ];

  const typography = [
    { size: 'var(--text-3xl)', label: 'text-3xl' },
    { size: 'var(--text-2xl)', label: 'text-2xl' },
    { size: 'var(--text-xl)', label: 'text-xl' },
    { size: 'var(--text-lg)', label: 'text-lg' },
    { size: 'var(--text-md)', label: 'text-md' },
    { size: 'var(--text-base)', label: 'text-base' },
    { size: 'var(--text-sm)', label: 'text-sm' },
    { size: 'var(--text-xs)', label: 'text-xs' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Design System Showcase</h1>
        <p className={styles.subtitle}>
          Tổng hợp các Component dùng chung và Design Tokens (Colors, Typography, Spacing).
        </p>
      </div>

      {/* Colors Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Colors & Tokens</h2>
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
        <h2 className={styles.sectionTitle}>Typography</h2>
        <div className={styles.section}>
          {typography.map((type) => (
            <div key={type.label} className={styles.fontRow}>
              <span className={styles.fontLabel}>{type.label}</span>
              <span style={{ fontSize: type.size, fontWeight: 'var(--weight-semibold)' }}>
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Buttons</h2>
        <div className={styles.flexRow}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className={styles.flexRow}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
        <div className={styles.flexRow}>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
        <div className={styles.flexRow}>
          <Button variant="secondary" icon={<Icon name="add" size="sm" />}>With Icon</Button>
          <Button variant="primary" icon={<Icon name="arrow_forward" size="sm" />} iconPosition="right">Icon Right</Button>
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
          <Badge variant="ghost">Ghost</Badge>
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
            label="With Icon" 
            placeholder="Search..." 
            // InputField trong project Memo chưa hỗ trợ prop icon trực tiếp, nên ta bỏ qua prop icon
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
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
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
