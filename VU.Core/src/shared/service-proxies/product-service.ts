import { mergeMap as _observableMergeMap, catchError as _observableCatch } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API_BASE_URL, ServiceProxyBase } from "./service-proxies-base";
import { Page } from "@shared/model/page";
import { AppConsts } from "@shared/AppConsts";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class ProductService extends ServiceProxyBase {
	confirm(partnerId: any) {
		throw new Error("Method not implemented.");
	}
	private newsEndpoint = `/find-all`;
	private mediaEndpoint = `/media`;
	private knowledgeBaseEndpoint = `/knowledge-base`;

	constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
		super(messageService, _cookieService, http, baseUrl);
		this.baseUrl = this.baseUrl.concat('/api/product')

	}

	getAll(page: Page, status: string): Observable<any> {
		let url_ = `${this.newsEndpoint}?`;
		if(status){
			url_ += this.convertParamUrl("status", status??'');
		}
		if(page.keyword.trim()) {
			url_ += this.convertParamUrl("keyword", page.keyword);
		}
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

		return this.requestGet(url_);
	}

	createProduct(body): Observable<any> {
		return this.requestPost(body, `/add`);
	}
	saveProduct(body): Observable<any> {
		let updateUrl = `/update`
		return this.requestPatch(body, `${updateUrl}`);
	}

	deleteProduct(productId): Observable<any> {
		let url_ = `/delete/${productId}`;
        return this.requestDelete(url_);
	}

	// Lấy thông tin chính sách
    getProductById(productId): Observable<any> {
        let url_ = `/find-by-id/${productId}`;
        return this.requestGet(url_);
    }
	//Update detail
	updateProductDetail(body): Observable<any> {
        return this.requestPut(body, `/update-detail`);
    }

	addProductDetail(body): Observable<any> {
        return this.requestPost(body, `/add-detail`);
    }

	deleteProductDetail(id): Observable<any> {
        return this.requestDelete(`/delete-detail/${id}`);
    }
}

