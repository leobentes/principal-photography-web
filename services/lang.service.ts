import { Injectable, LOCALE_ID, Inject } from '@angular/core';

@Injectable()
export class LangService {

    _currentLanguage: string = 'en-US';
    _browserLanguage: string = 'en';
    _dateFormat: string = "dd/MM/yyyy";

    MSG_PROJECT_CREATED: number = 0;
    MSG_PROJECT_UPDATED: number = 1;
    MSG_PROJECT_DELETED: number = 2;
    MSG_ERROR_SAVING_PROJECT: number = 3;
    MSG_ERROR_DELETING_PROJECT: number = 4;
    MSG_CLEAR_FORM: number = 5;
    MSG_DELETE_PROJECT: number = 6;
    MSG_CANCEL_UPDATE: number = 7;
    MSG_QUIT_FORM: number = 8;
    MSG_ERROR_DATE_INTERVAL: number = 9;
    MSG_ERROR_MISSING_CREW_POSITION: number = 10;
    MSG_SELECT_CITY: number = 11;
    MSG_COPIED_TO_CLIPBOARD: number = 12;

    MESSAGES = [];

    constructor(@Inject(LOCALE_ID) language: string) { 

        this.setupLanguage(language);

        this.MESSAGES[this.MSG_PROJECT_CREATED] = { 
            "en-US": "Project \'%s\' created.", 
            pt: "Filmagem \'%s\' criada."};
        this.MESSAGES[this.MSG_PROJECT_UPDATED] = { 
            "en-US": "Project \'%s\' updated.", 
            pt: "Filmagem \'%s\' atualizada."};
        this.MESSAGES[this.MSG_PROJECT_DELETED] = { 
            "en-US": "Project \'%s\' deleted.", 
            pt: "Filmagem \'%s\' removida."};
        this.MESSAGES[this.MSG_ERROR_SAVING_PROJECT] = { 
            "en-US": "Error on saving project \'%s\'.\nPlease try again in a few moments.", 
            pt: "Erro ao salvar o projeto \'%s\'.\nPor favor tente novamente em alguns minutos."};
        this.MESSAGES[this.MSG_ERROR_DELETING_PROJECT] = { 
            "en-US": "Error on deleting project \'%s\'.\nPlease try again in a few moments.", 
            pt: "Erro ao remover o projeto \'%s\'.\nPor favor tente novamente em alguns minutos."};
        this.MESSAGES[this.MSG_CLEAR_FORM] = { 
            "en-US": "Are you sure you want to clear the form?", 
            pt: "Tem certeza que deseja limpar o formulário?"};
        this.MESSAGES[this.MSG_DELETE_PROJECT] = { 
            "en-US": "Are you sure you want to delete project \'%s\'?", 
            pt: "Tem certeza que deseja remover o projeto  \'%s\'?"};
        this.MESSAGES[this.MSG_CANCEL_UPDATE] = { 
            "en-US": "Are you sure you want to cancel the update?", 
            pt: "Tem certeza que deseja cancelar as alterações?"};
        this.MESSAGES[this.MSG_QUIT_FORM] = { 
            "en-US": "Quiting will discard any typed information. Are you sure you want to quit?", 
            pt: "Essa operação irá descartar os dados digitados. Tem certeza?"};
        this.MESSAGES[this.MSG_ERROR_DATE_INTERVAL] = { 
            "en-US": "Final date must be greater than or equal to inital date", 
            pt: "Data final tem que ser maior ou igual à data inicial."};
        this.MESSAGES[this.MSG_ERROR_MISSING_CREW_POSITION] = { 
            "en-US": "Please include at least one crew position.", 
            pt: "Por favor inclua pelo menos uma função de set."};      
        this.MESSAGES[this.MSG_SELECT_CITY] = { 
            "en-US": "Please select a city.", 
            pt: "Por favor selecione uma cidade."};              
        this.MESSAGES[this.MSG_COPIED_TO_CLIPBOARD] = { 
            "en-US": "Link copied to clipboard.", 
            pt: "Link copiado para a área de transferência."};             
    }

    setupLanguage(language): void{
        this._currentLanguage = language;
        this._browserLanguage = navigator.language;
        let p = this._browserLanguage.indexOf('-');
        this._browserLanguage = ( p < 0) ? this._browserLanguage : this._browserLanguage.slice(0,p);
        this._dateFormat = (this._browserLanguage === 'en') ? 'MM/dd/yyyy': 'dd/MM/yyyy';
    }

    message(msgID: number, textToInsert?: string): string {
        let i18nMessage: string = this.MESSAGES[msgID][this._currentLanguage];
        if (typeof textToInsert == 'undefined') textToInsert = "";
        return i18nMessage.replace ("%s", textToInsert);
    }

    getLanguage(): string {
      return this._currentLanguage;
    }

    getBrowserLanguage(): string {
        return this._browserLanguage;
    }

    getDateFormat(): string {
        return this._dateFormat;
    }
}
