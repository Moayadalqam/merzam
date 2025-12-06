import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export function ServiceItem({
  service,
  isSelected,
  serviceData,
  onToggle,
  onOptionChange,
}) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleHeaderClick = () => {
    onToggle();
    if (!isSelected) {
      setIsOpen(true);
    }
  };

  const handleArrowClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const renderOption = (option) => {
    const optionValue = serviceData?.[option.id];

    // Simple checkbox option
    if (option.type === 'checkbox' && !option.choices) {
      return (
        <label key={option.id} className="sub-option">
          <input
            type="checkbox"
            checked={!!optionValue}
            onChange={(e) => onOptionChange(option.id, e.target.checked)}
          />
          <span className="sub-option-label">
            {lang === 'ar' ? option.labelAr : option.labelEn}
          </span>
        </label>
      );
    }

    // Radio options
    if (option.type === 'radio' && option.choices) {
      return (
        <div key={option.id} className="option-group">
          <div className="option-group-label">
            {lang === 'ar' ? option.labelAr : option.labelEn}
          </div>
          {option.choices.map((choice) => (
            <label key={choice.id} className="sub-option">
              <input
                type="radio"
                name={`${service.id}-${option.id}`}
                value={choice.id}
                checked={optionValue === choice.id}
                onChange={() => onOptionChange(option.id, choice.id)}
              />
              <span className="sub-option-label">
                {lang === 'ar' ? choice.labelAr : choice.labelEn}
              </span>
            </label>
          ))}
        </div>
      );
    }

    // Checkbox with choices
    if (option.type === 'checkbox' && option.choices) {
      return (
        <div key={option.id} className="option-group">
          <div className="option-group-label">
            {lang === 'ar' ? option.labelAr : option.labelEn}
          </div>
          {option.choices.map((choice) => (
            <label key={choice.id} className="sub-option">
              <input
                type="checkbox"
                checked={optionValue === choice.id || (Array.isArray(optionValue) && optionValue.includes(choice.id))}
                onChange={(e) => {
                  if (e.target.checked) {
                    onOptionChange(option.id, choice.id);
                  } else {
                    onOptionChange(option.id, null);
                  }
                }}
              />
              <span className="sub-option-label">
                {lang === 'ar' ? choice.labelAr : choice.labelEn}
              </span>
            </label>
          ))}
        </div>
      );
    }

    // Group with multiple sub-groups (like bed base with size and material)
    if (option.type === 'group' && option.groups) {
      return (
        <div key={option.id} className="option-group">
          <div className="option-group-label">
            {lang === 'ar' ? option.labelAr : option.labelEn}
          </div>
          {option.groups.map((group) => (
            <div key={group.id} className="option-group" style={{ marginLeft: '12px' }}>
              <div className="option-group-label" style={{ fontSize: '10px', opacity: 0.7 }}>
                {lang === 'ar' ? group.labelAr : group.labelEn}
              </div>
              {group.choices.map((choice) => (
                <label key={choice.id} className="sub-option">
                  <input
                    type="radio"
                    name={`${service.id}-${option.id}-${group.id}`}
                    value={choice.id}
                    checked={serviceData?.[`${option.id}-${group.id}`] === choice.id}
                    onChange={() => onOptionChange(`${option.id}-${group.id}`, choice.id)}
                  />
                  <span className="sub-option-label">
                    {lang === 'ar' ? choice.labelAr : choice.labelEn}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`accordion-item ${isSelected ? 'active' : ''} ${isOpen && isSelected ? 'open' : ''}`}
    >
      <div className="accordion-header" onClick={handleHeaderClick}>
        <div className="accordion-checkbox">
          <svg viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" fill="none" />
          </svg>
        </div>
        <span className="accordion-title">
          {lang === 'ar' ? service.nameAr : service.nameEn}
          {lang === 'en' && (
            <span className="accordion-title-ar">{service.nameAr}</span>
          )}
        </span>
        {isSelected && service.options?.length > 0 && (
          <svg
            className="accordion-arrow"
            viewBox="0 0 24 24"
            onClick={handleArrowClick}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </div>

      {isSelected && service.options?.length > 0 && (
        <div className="accordion-content">
          <div className="accordion-body">
            {service.options.map(renderOption)}
          </div>
        </div>
      )}
    </div>
  );
}
