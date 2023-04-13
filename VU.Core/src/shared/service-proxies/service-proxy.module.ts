import { SaleService } from './sale-service';
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
//import { AbpHttpInterceptor } from "abp-ng2-module";

import * as ApiServiceProxies from "./service-proxies";
import * as ApproveServiceProxies from "./approve-service";
import * as ProvinceServiceProxies from "./province-service";
import * as FileServiceProxies from "./file-service";
import { ProductService } from "./product-service";
import { NotificationService } from "./notification-service";
import { ProvinceServiceProxy } from "./province-service";
import { NotVerifiedServiceProxy } from './not-verified-service';
import { ReceiveOrderService } from './receiver-order-service';

@NgModule({
    providers: [
        //core
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        //File
        FileServiceProxies.FileServiceProxy,
        //{ provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
        ApproveServiceProxies.ApproveServiceProxy,
        ProvinceServiceProxy,
        ProductService,
        ReceiveOrderService,
        NotificationService,
        NotVerifiedServiceProxy,
    ]
})
export class ServiceProxyModule { }
