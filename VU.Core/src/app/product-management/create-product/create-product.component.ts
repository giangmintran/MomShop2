import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ActiveDeactiveConst, AppConsts, FormNotificationConst, MediaConst, MessageErrorConst, PolicyDetailTemplateConst, PolicyTempConst, YesNoConst, } from "@shared/AppConsts";
import { OJBECT_DISTRIBUTION_CONST } from "@shared/base-object";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { PageBondPolicyTemplate } from "@shared/model/pageBondPolicyTemplate";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CreateProductDetailComponent } from "./create-product-detail/create-product-detail.component";
import { ProductService } from "@shared/service-proxies/product-service";
import { DistributionService } from "@shared/services/distribution.service";
import { FormNotificationComponent } from "../../../app/form-notification/form-notification.component";

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class CreateProductComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private routeActive: ActivatedRoute,
    public configDialog: DynamicDialogConfig,
    private productService: ProductService,
    public confirmationService: ConfirmationService,
    private _distributionService: DistributionService,
    public ref: DynamicDialogRef,
    private _dialogService: DialogService,

  ) {
    super(injector, messageService);
  }

  distributionId: number;
  types = MediaConst.productType;
  statuses = MediaConst.productStatus;
  fieldErrors: any = {};
  isCreateDetail: boolean;
  isCreateContractTemp: boolean;
  rows: any[] = [];

  ActiveDeactiveConst = ActiveDeactiveConst;
  YesNoConst = YesNoConst;
  PolicyTempConst = PolicyTempConst;
  PolicyDetailTemplateConst = PolicyDetailTemplateConst;
  MessageErrorConst = MessageErrorConst;
  row: any;
  col: any;

  product: any = {
    'name': null,
    'price': null,
    'description': null,
    'status': null,
    'productType': null,
  }

  policyId: number;
  productId: number;
  listRepeatFixedDate: any[] = [];

  blockText: RegExp = /[0-9,.]/;
  submitted: boolean;
  //
  cols: any[];

  productDetail: any[] = [];

  listActionPolicyDetail: any[] = [];
  listActionPolicyContractTemp: any[] = [];
  //
  page = new Page();
  offset = 0;
  fieldDates = ["startDate", "endDate"];

  isCollapse: boolean = false;

  ngOnInit(): void {
    this.isCreateDetail = this.configDialog?.data?.isCreateDetail;
    if (this.configDialog.data?.productId){
      this.isLoadingPage = true;
      this.productService.getProductById(this.configDialog.data?.productId).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, "")) {
            this.product = response?.data;
            this.genlistActionPolicyDetail(this.product.productDetails);
          }
          this.isLoadingPage = false;
        },
        (err) => {
          console.log("err----", err);
          this.isLoadingPage = false;
        }
      );
    }
    //
    if (this.productId) {
      this.getDetail(this.productId);
    }
  }

  collapse() {
    this.isCollapse = !this.isCollapse;
  }

  getDetail(productId) {
    this.configDialog.header = "Cập nhật thông tin sản phẩm";
    this.isLoadingPage = true;
    this.productService.getProductById(productId).subscribe((res) => {
      this.isLoadingPage = false;
        if (this.handleResponseInterceptor(res, "")) {
          if(res?.data) {
            this.product = res?.data;
            //
            this.formatCalendarDisplay(this.fieldDates, this.product);
            //
            this.genlistActionPolicyDetail(this.product?.productDetails);
            // this.genlistActionPolicyContractTemp(this.policy?.contractTemplates);
          }
          //
          if (this.isCreateDetail) {
            this.isCreateDetail = false;
            this.isCollapse = true;
          }
          //
          if(this.isCreateContractTemp) {
            this.isCreateContractTemp = false;
            this.isCollapse = true;
          }
        }
      },(err) => {
        console.log("err---", err);
      }
    );
  }

  getAllPolicyDetail(productId) {
    this._distributionService.getAllPolicyDetail(productId).subscribe(
      (res) => {
        if (this.handleResponseInterceptor(res, "")) {
          // this.policy.policyDetails = res?.data;
          // this.genlistActionPolicyDetail(this.policy.policyDetails);
        }
      },
      (err) => {
        console.log("err----", err);
      }
    );
  }

  genlistActionPolicyDetail(data = []) {
    this.listActionPolicyDetail = data.map((productDetail, index) => {
      const actions = [];

        actions.push({
          data: productDetail,
          label: "Sửa",
          icon: "pi pi-pencil",
          command: ($event) => {
            console.log("$event.item.data", $event.item.data);
            console.log("$22222222222", $event.item.data);
            this.editProductDetail($event.item.data);
          },
        });
      //
        actions.push({
          data: productDetail,
          index: index,
          label: "Xoá",
          icon: "pi pi-trash",
          command: ($event) => {
            this.deleteProductDetail($event.item.data, $event.item.index);
          },
        });

      return actions;
    });
    console.log("listActions ki han", this.listActionPolicyDetail);
  }

  // THÊM MỚI KỲ HẠN
  createProductDetail() {
    const ref = this.dialogService.open(
      CreateProductDetailComponent,
      {
        header: "Thêm thông tin chi tiết",
        width: "800px",
        contentStyle: { "max-height": "600px", overflow: "auto", "margin-bottom": "60px", },
        baseZIndex: 10000,
        data: {
          productId: this.product.id,
        },
      }
    );
    ref.onClose.subscribe((statusCreate) => {      
      if(statusCreate) {
        this.getDetail(this.product.id);
      }
    });
  }

  // CẬP NHẬT KỲ HẠN
  editProductDetail(productDetail) {
    const ref = this.dialogService.open(
      CreateProductDetailComponent,
      {
        header: "Cập nhật kỳ hạn",
        width: "800px",
        contentStyle: { "max-height": "600px", overflow: "auto", "margin-bottom": "60px", },
        baseZIndex: 10000,
        data: {
          productDetail: productDetail,
        },
      }
    );
    //
    ref.onClose.subscribe((statusUpdate) => {
        this.getDetail(this.product.id);
    });
  }

  // XOA KỲ HAN
  deletePolicyDetail(policyDetail, index) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa kỳ hạn "${policyDetail?.name}"`,
      header: "Xóa kỳ hạn",
      icon: "pi pi-question-circle",
      acceptLabel: "Đồng ý",
      rejectLabel: "Hủy bỏ",
      accept: () => {
        this._distributionService.deletePolicyDetail(policyDetail.id).subscribe((res) => {
          if (this.handleResponseInterceptor(res, "Xóa thành công!")) {
            this.getDetail(policyDetail?.policyId);
          }
        },(err) => {
            console.log("err----", err);
          }
        );
      },
    });
  }

  deleteProductDetail(productDetail, index) {
    console.log('deleteProductDetail', productDetail);
    const ref = this._dialogService.open(
      FormNotificationComponent,
      {
        header: "Thông báo",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          title: "Bạn có muốn xoá thông tin này?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      }
    );
    ref.onClose.subscribe((dataCallBack) => {
      if (dataCallBack?.accept) {
        productDetail.status = 3;
       this.productService.deleteProductDetail(productDetail.id).subscribe(res => {
         this.messageService.add({
           severity: 'success',
           summary: "Xoá thành công",
           life: 3000,
         })
         this.getDetail(this.product.id)
       }, err => {
         this.messageService.add({
           severity: 'error',
           summary: "Xoá thất bại",
           detail: "Vui lòng thử lại",
           life: 3000,
         })
       })
      }
    });
  }

  //
  save() {
    if(this.validForm()) { 
      this.submitted = true;
      if (this.product.id) {
        this.productService.saveProduct(this.product).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
              this.ref.close();
            }
            this.submitted = false;
            //
          },(err) => {
            console.log("err---", err);
            this.submitted = false;
          }
        );
      } else {
        console.log("Vào đây");
        this.productService.createProduct(this.product).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Thêm thành công")) {
                this.ref.close();
            }
            this.submitted = false;
          }, (err) => {
            console.log("err----", err);
            this.submitted = false;
          }
        );
      }
    } else {
			this.messageError(MessageErrorConst.message.Validate);
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


  formatCurrency(value) {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "USD",
    });
  }
}
