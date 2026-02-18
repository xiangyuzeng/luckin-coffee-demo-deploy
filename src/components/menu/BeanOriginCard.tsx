'use client';

import { motion } from 'framer-motion';
import { MapPin, Mountain, Droplets, Flame, Award, Leaf } from 'lucide-react';
import { BeanOrigin, getCountryFlag } from '@/lib/fake-data/bean-origins';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface BeanOriginCardProps {
  origin: BeanOrigin;
}

export default function BeanOriginCard({ origin }: BeanOriginCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Origin header */}
      <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
        <span className="text-3xl">{getCountryFlag(origin.country)}</span>
        <div>
          <h4 className="font-bold text-amber-900">{origin.country}</h4>
          <p className="text-sm text-amber-700">{origin.region}</p>
          {origin.farmName && (
            <p className="text-xs text-amber-600">{origin.farmName}</p>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <Mountain className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">{t('beanOrigin.altitude')}</p>
            <p className="text-sm font-medium">{origin.altitude}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <Droplets className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">{t('beanOrigin.process')}</p>
            <p className="text-sm font-medium">{origin.process}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <Flame className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">{t('beanOrigin.roast')}</p>
            <p className="text-sm font-medium">{origin.roastProfile}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <MapPin className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">{t('beanOrigin.region')}</p>
            <p className="text-sm font-medium">{origin.region}</p>
          </div>
        </div>
      </div>

      {/* Tasting notes */}
      <div>
        <h5 className="mb-2 text-sm font-medium text-gray-700">{t('beanOrigin.tastingNotes')}</h5>
        <div className="flex flex-wrap gap-2">
          {origin.tastingNotes.map((note, index) => (
            <span
              key={index}
              className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {origin.certifications.length > 0 && (
        <div>
          <h5 className="mb-2 text-sm font-medium text-gray-700">{t('beanOrigin.certifications')}</h5>
          <div className="flex flex-wrap gap-2">
            {origin.certifications.map((cert, index) => (
              <span
                key={index}
                className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
              >
                {cert.includes('Fair Trade') ? (
                  <Award className="h-3 w-3" />
                ) : (
                  <Leaf className="h-3 w-3" />
                )}
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Story */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
        <h5 className="mb-2 text-sm font-medium text-amber-900">{t('beanOrigin.story')}</h5>
        <p className="text-sm leading-relaxed text-amber-800">{origin.story}</p>
      </div>
    </motion.div>
  );
}
