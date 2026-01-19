export interface I18nMessages {
  [locale: string]: {
    [key: string]: string;
  };
}

export class I18nService {
  private messages: I18nMessages = {
    en: {
      "BadRequest": "Bad Request",
      "Unauthorized": "Unauthorized",
      "Forbidden": "Forbidden",
      "NotFound": "Not Found",
      "Conflict": "Conflict",
      "ValidationError": "Validation Error",
      "InternalServerError": "Internal Server Error",
      "RateLimit": "Too Many Requests",
      "MongoDBDuplicate": "Duplicate value for field",
      "MongoDBValidation": "Database validation error",
      "MongoDBCast": "Invalid data type",
    },
    fr: {
      "BadRequest": "Mauvaise Requête",
      "Unauthorized": "Non autorisé",
      "Forbidden": "Interdit",
      "NotFound": "Non trouvé",
      "Conflict": "Conflit",
      "ValidationError": "Erreur de validation",
      "InternalServerError": "Erreur interne du serveur",
      "RateLimit": "Trop de demandes",
      "MongoDBDuplicate": "Valeur dupliquée pour le champ",
      "MongoDBValidation": "Erreur de validation de base de données",
      "MongoDBCast": "Type de données invalide",
    },
    es: {
      "BadRequest": "Solicitud Incorrecta",
      "Unauthorized": "No Autorizado",
      "Forbidden": "Prohibido",
      "NotFound": "No Encontrado",
      "Conflict": "Conflicto",
      "ValidationError": "Error de Validación",
      "InternalServerError": "Error Interno del Servidor",
      "RateLimit": "Demasiadas Solicitudes",
      "MongoDBDuplicate": "Valor duplicado para el campo",
      "MongoDBValidation": "Error de validación de base de datos",
      "MongoDBCast": "Tipo de datos inválido",
    },
  };

  private currentLocale: string = "en";

  setLocale(locale: string): void {
    if (this.messages[locale]) {
      this.currentLocale = locale;
    }
  }

  addLocale(locale: string, messages: Record<string, string>): void {
    this.messages[locale] = messages;
  }

  translate(key: string, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    return this.messages[targetLocale]?.[key] || key;
  }

  getAvailableLocales(): string[] {
    return Object.keys(this.messages);
  }
}

export const i18n = new I18nService();
