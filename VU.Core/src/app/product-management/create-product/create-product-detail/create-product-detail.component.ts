import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PolicyDetailTemplateConst, PolicyTempConst, } from "@shared/AppConsts";
import { OJBECT_DISTRIBUTION_CONST } from "@shared/base-object";
import { CrudComponentBase } from "@shared/crud-component-base";
import { ProductService } from "@shared/service-proxies/product-service";
import { DistributionService } from "@shared/services/distribution.service";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

const { BASE } = OJBECT_DISTRIBUTION_CONST;

@Component({
  selector: 'app-create-product-detail',
  templateUrl: './create-product-detail.component.html',
  styleUrls: ['./create-product-detail.component.scss'],
})
export class CreateProductDetailComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef,
    public configDialog: DynamicDialogConfig,
    private routeActive: ActivatedRoute,
    private productService: ProductService
      ) {
    super(injector, messageService);
  }

  distributionId: number;
  productId: number;

  policyTemp: any[] = [];
  policyDetails: any[] = [];

  fieldErrors: any = {};

  // Data Init
  PolicyTempConst = PolicyTempConst;
  PolicyDetailTemplateConst = PolicyDetailTemplateConst;

  productDetail: any = { 
    'size': null,
    'productId': null,
    'quantity': null,
    'description': null
  };
  
  policyTemplateType: any;

  blockText: RegExp = /[0-9,.]/;
  submitted: boolean;

  cols: any[];
  statuses: any[];

  listRepeatFixedDate = [];

  ngOnInit(): void {
    console.log("aaaa", this.configDialog?.data?.productId);
    this.isLoadingPage = true;
    if (this.productId){
      this.productService.getProductById(this.productId).subscribe((response) => {
        if (this.handleResponseInterceptor(response, "")) {
            this.productDetail = response.data
            console.log("bbbbbbb", response.data);

        }
      },
      (err) => {
        console.log("err----", err);
        this.isLoadingPage = false;
      }
    );
    }
    // SET DATA ĐẨY SANG TỪ DYNAMIC DIALOG
    this.productId = this.configDialog?.data?.productId;
    if (this.configDialog?.data?.productDetail) {
      this.productDetail = this.configDialog.data.productDetail;
    }
    console.log("productDetail", this.productDetail);
  }

  save() {
    console.log("ádasdas")
    // this.submitted = true;
    if (this.productDetail?.id) {
      this.productService.updateProductDetail(this.productDetail).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
            this.ref.close(true);
          }
          this.submitted = false;
        },(err) => {
          console.log("errUpdate---", err);
          this.submitted = false;
        }
      );
    } else {
      this.productDetail.productId = this.productId;
      this.productService.addProductDetail(this.productDetail).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Thêm thành công")) {
            this.ref.close(true);
          }
          this.submitted = false;
        },(err) => {
          this.submitted = false;
        }
      );
    }
  }

  close() {
    this.ref.close();
  }

  validForm(): boolean {
    return true;
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }
}
