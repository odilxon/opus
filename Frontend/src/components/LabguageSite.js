import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LabguageSite = () => {
  const { t, i18n } = useTranslation();

  function handleClick(lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <NavDropdown title={t('lang')}>
      <NavDropdown.Item onClick={() => handleClick(`uz`)}>Uz</NavDropdown.Item>
      <NavDropdown.Item onClick={() => handleClick(`ru`)}>Ru</NavDropdown.Item>
    </NavDropdown>
  );
};

export default LabguageSite;
