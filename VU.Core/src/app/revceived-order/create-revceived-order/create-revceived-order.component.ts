import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActiveDeactiveConst, MediaConst, MessageErrorConst, PolicyDetailTemplateConst, PolicyTempConst, ReceivedOrder, YesNoConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { ProductService } from '@shared/service-proxies/product-service';
import { ReceiveOrderService } from '@shared/service-proxies/receiver-order-service';
import { DistributionService } from '@shared/services/distribution.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-revceived-order',
  templateUrl: './create-revceived-order.component.html',
  styleUrls: ['./create-revceived-order.component.scss']
})
export class CreateRevceivedOrderComponent extends CrudComponentBase implements OnInit {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private routeActive: ActivatedRoute,
    public configDialog: DynamicDialogConfig,
    private productService: ProductService,
    public confirmationService: ConfirmationService,
    private receiveOrderService: ReceiveOrderService,
    public ref: DynamicDialogRef,
    private _dialogService: DialogService,

  ) {
    super(injector, messageService);
  }

  distributionId: number;
  types = MediaConst.productType;
  statuses = ReceivedOrder.ReceivedOrderStatus;
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
  receiveOrderId: number;
  receivedOrder: any = {
    'code': null,
    'createdDate': null,
    'receivedDate': null,
    'supplier': null,
    'receiver': null,
    'status': null,
    'description': null,
  }

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
  fieldDates = ["createdDate", "receivedDate"];

  isCollapse: boolean = false;

  ngOnInit(): void {

    if (this.configDialog.data?.receiveOrder){
      this.receivedOrder  = this.formatCalendarDisplay(this.fieldDates,this.configDialog.data?.receiveOrder)
    }
    console.log("aaaaaavsadasdasd", this.receivedOrder);
    if (this.configDialog.data?.receiveOrderId){
      this.isLoadingPage = true;
      this.receiveOrderService.getReceiveOrderById(this.configDialog.data?.receiveOrderId).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, "")) {
            this.receivedOrder = this.formatCalendarDisplay(this.fieldDates,response?.data);
            this.genlistActionPolicyDetail(this.receivedOrder.productDetails);
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
    if (this.receiveOrderId) {
      this.getDetail(this.receivedOrder);
    }
  }

  collapse() {
    this.isCollapse = !this.isCollapse;
  }

  getDetail(productId) {
    this.isLoadingPage = true;
    this.productService.getProductById(productId).subscribe((res) => {
      this.isLoadingPage = false;
        if (this.handleResponseInterceptor(res, "")) {
          if(res?.data) {
            this.receivedOrder = res?.data;
            //
            this.formatCalendarDisplay(this.fieldDates, this.receivedOrder);
            //
            this.genlistActionPolicyDetail(this.receivedOrder?.productDetails);
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
    // const ref = this.dialogService.open(
    //   CreateProductDetailComponent,
    //   {
    //     header: "Thêm thông tin chi tiết",
    //     width: "800px",
    //     contentStyle: { "max-height": "600px", overflow: "auto", "margin-bottom": "60px", },
    //     baseZIndex: 10000,
    //     data: {
    //       productId: this.product.id,
    //     },
    //   }
    // );
    // ref.onClose.subscribe((statusCreate) => {      
    //   if(statusCreate) {
    //     this.getDetail(this.product.id);
    //   }
    // });
  }

  // CẬP NHẬT KỲ HẠN
  editProductDetail(productDetail) {
    // const ref = this.dialogService.open(
    //   CreateProductDetailComponent,
    //   {
    //     header: "Cập nhật kỳ hạn",
    //     width: "800px",
    //     contentStyle: { "max-height": "600px", overflow: "auto", "margin-bottom": "60px", },
    //     baseZIndex: 10000,
    //     data: {
    //       productDetail: productDetail,
    //     },
    //   }
    // );
    // //
    // ref.onClose.subscribe((statusUpdate) => {
    //     this.getDetail(this.product.id);
    // });
  }

  deleteProductDetail(productDetail, index) {
    // console.log('deleteProductDetail', productDetail);
    // const ref = this._dialogService.open(
    //   FormNotificationComponent,
    //   {
    //     header: "Thông báo",
    //     width: '600px',
    //     contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
    //     styleClass: 'p-dialog-custom',
    //     baseZIndex: 10000,
    //     data: {
    //       title: "Bạn có muốn xoá thông tin này?",
    //       icon: FormNotificationConst.IMAGE_CLOSE,
    //     },
    //   }
    // );
    // ref.onClose.subscribe((dataCallBack) => {
    //   if (dataCallBack?.accept) {
    //     productDetail.status = 3;
    //    this.productService.deleteProductDetail(productDetail.id).subscribe(res => {
    //      this.messageService.add({
    //        severity: 'success',
    //        summary: "Xoá thành công",
    //        life: 3000,
    //      })
    //      this.getDetail(this.product.id)
    //    }, err => {
    //      this.messageService.add({
    //        severity: 'error',
    //        summary: "Xoá thất bại",
    //        detail: "Vui lòng thử lại",
    //        life: 3000,
    //      })
    //    })
    //   }
    // });
  }

  //
  save() {
    if(this.validForm()) { 
      this.submitted = true;
      if (this.receivedOrder.id) {
        this.receiveOrderService.saveReceiveOrder(this.receivedOrder).subscribe((response) => {
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
        this.receiveOrderService.createReceiveOrder(this.receivedOrder).subscribe((response) => {
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
