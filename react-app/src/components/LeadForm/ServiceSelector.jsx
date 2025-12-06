import { useLanguage } from '../../context/LanguageContext';
import { services } from '../../data/services';
import { ServiceItem } from './ServiceItem';

export function ServiceSelector({ selectedServices, onToggleService, onOptionChange }) {
  const { t } = useLanguage();

  return (
    <div className="field field-full">
      <label>{t('Services Required', 'الخدمات المطلوبة')}</label>
      <div className="accordion">
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            isSelected={!!selectedServices[service.id]?.selected}
            serviceData={selectedServices[service.id]}
            onToggle={() => onToggleService(service.id)}
            onOptionChange={(optionId, value) =>
              onOptionChange(service.id, optionId, value)
            }
          />
        ))}
      </div>
    </div>
  );
}
