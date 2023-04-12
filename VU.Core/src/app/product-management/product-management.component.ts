import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActiveDeactiveConst, AppConsts, FormNotificationConst, MediaConst, PolicyDetailTemplateConst, PolicyTempConst, ProductPolicyConst, SearchConst, YesNoConst, } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { PageBondPolicyTemplate } from "@shared/model/pageBondPolicyTemplate";
import { DistributionService } from "@shared/services/distribution.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { BreadcrumbService } from "../layout/breadcrumb/breadcrumb.service";
import { CreateProductComponent } from "./create-product/create-product.component";
import { Page } from '@shared/model/page';
import { ProductService } from "@shared/service-proxies/product-service";
import { FormSetDisplayColumnComponent } from "../form-set-display-column/form-set-display-column.component";
import { FormNotificationComponent } from "../form-notification/form-notification.component";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private _distributionService: DistributionService,
    private productService: ProductService,
    public confirmationService: ConfirmationService,

  ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: "Trang chủ", routerLink: ["/home"] },
      { label: "Quản lý sản phẩm" },
    ]);
  }

  @Input() distributionId: number;
  rows: any[] = [];

  ActiveDeactiveConst = ActiveDeactiveConst;
  PolicyTempConst = PolicyTempConst;
  PolicyDetailTemplateConst = PolicyDetailTemplateConst;
  YesNoConst = YesNoConst;
  MediaConst = MediaConst;

  row: any;
  col: any;

  _selectedColumns: any[];
  statusSearch = MediaConst.productStatus;
  cols: any[];

  dataFilter = {
		status: null,
	}

  listAction: any[] = [];
  //
  page = new Page();
  offset = 0;

  ngOnInit(): void {
    this.setPage({ page: this.offset });
    // this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
    //   if (this.keyword === "") {
    //     this.setPage({ page: this.offset });
    //   } else {
    //     this.setPage();
    //   }
    // });

    // Xử lý ẩn hiện cột trong bảng
    this.cols = [
      { field: 'code', header: 'Code', width: '12rem' },
      { field: 'name', header: 'Name', width: '16rem' },
      { field: 'price', header: 'Price', width: '12rem' },
      { field: 'productTypeName', header: 'ProductType', width: '15rem'},
      { field: 'description', header: 'Description', width: '45rem'}
    ];

    this.cols = this.cols.map((item, index) => {
      item.position = index + 1;
      return item;
    });

    this._selectedColumns = this.cols;
  }

  setColumn(col, _selectedColumns) {
    const ref = this.dialogService.open(
      FormSetDisplayColumnComponent,
      this.getConfigDialogServiceDisplayTableColumn1(col, _selectedColumns)
    );
    //
    ref.onClose.subscribe((dataCallBack) => {
      if (dataCallBack?.accept) {
        this._selectedColumns = dataCallBack.data.sort(function (a, b) {
          return a.position - b.position;
        });
      }
    });
  }

  showData(rows) {
    for (let row of rows) {
      row.code = row.code,
      row.productTypeName = MediaConst.getProductType(row.productType);
    }
  }

  genListAction(data = []) {
    this.listAction = data.map((product, index) => {
      const actions = [];
        actions.push({
          data: product,
          index: index,
          label: "Sửa",
          icon: "pi pi-pencil",
          command: ($event) => {
            this.edit($event.item.data);
          },
        });
      //
        actions.push({
          data: product,
          label: "Xoá",
          icon: "pi pi-trash",
          command: ($event) => {
            this.delete($event.item.data);
          },
        });
      //
      return actions;
    });
  }

  create() {
    const ref = this.dialogService.open(CreateProductComponent, {
      header: "Thêm sản phẩm",
      width: '1000px',
      contentStyle: { "max-height": "600px", overflow: "auto", "margin-bottom": "60px", },
      baseZIndex: 10000,
      data: {
      },
    });
    //
    ref.onClose.subscribe((res) => {
        this.setPage();
    });
  }

  edit(product, isCreateDetail?: boolean) {
    const ref = this.dialogService.open(CreateProductComponent, {
      header: "Cập nhật thông tin",
      width: "1000px",
      contentStyle: { "max-height": "600px", overflow: "auto", "margin-bottom": "60px", },
      baseZIndex: 10000,
      data: {
        productId: product.id,
      },
    });
    //
    ref.onClose.subscribe((statusUpdate) => {
      if (statusUpdate) {
        this.setPage();
      }
    });
  }

  delete(product) {
    const ref = this.dialogService.open(FormNotificationComponent, {
      header: "Thông báo",
      width: "600px",
      contentStyle: { "max-height": "600px", overflow: "auto", "padding-bottom": "50px", },
      styleClass: "p-dialog-custom",
      baseZIndex: 10000,
      data: {
        title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        icon: FormNotificationConst.IMAGE_CLOSE,
      },
    });
    ref.onClose.subscribe((dataCallBack) => {
      if (dataCallBack?.accept) {
        this.productService.deleteProduct(product.id).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Xóa sản phẩm thành công")) {
              this.setPage();
            }
          }, (err) => {
            console.log('err____', err);
            this.messageError(`Không xóa được sản phẩm ${product.name}`);
          });
      } else {
        this.messageService.add({
          severity: "error",
          detail: AppConsts.messageError,
          life: 2000,
        });
      }
    });
  }

  changeStatusPolicy(policy) {
    this._distributionService.changeStatusPolicy(policy.id).subscribe(
      (response) => {
        let message = "Kích hoạt thành công";
        if (policy.status == "A") message = "Hủy kích hoạt thành công";
        if (this.handleResponseInterceptor(response, message)) {
          this.setPage({ page: this.page.pageNumber });
        }
      },(err) => {
        console.log("err----", err);
        this.messageError(AppConsts.messageError);
      }
    );
  }

  changeStatus(){
    this.setPage({ Page: this.offset })
  }

  changeKeyword(){
    if (this.keyword === "") {
			this.setPage({ page: this.offset });
		}
  }

  getTableHeight(){

  }
  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    this.productService.getAll(this.page, this.status).subscribe((res) => {
        this.isLoading = false;
        if (this.handleResponseInterceptor(res, "")) {
          this.rows = res?.data.items;
          this.genListAction(this.rows);
          this.showData(this.rows);
          this.page.totalItems = res?.data?.totalItems;
        }
      }, (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
      });
    }
}
