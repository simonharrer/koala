import { HTTP_PROVIDERS, JSONP_PROVIDERS } from '@angular/http';
import { FORM_PROVIDERS} from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router';

export const APP_PROVIDERS = [
    FORM_PROVIDERS,
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    JSONP_PROVIDERS
];
