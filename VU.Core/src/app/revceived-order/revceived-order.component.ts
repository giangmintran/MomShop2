import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActiveDeactiveConst, PolicyTempConst, PolicyDetailTemplateConst, YesNoConst, MediaConst, FormNotificationConst, AppConsts, ReceivedOrder } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { DistributionService } from '@shared/services/distribution.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FormNotificationComponent } from '../form-notification/form-notification.component';
import { FormSetDisplayColumnComponent } from '../form-set-display-column/form-set-display-column.component';
import { BreadcrumbService } from '../layout/breadcrumb/breadcrumb.service';
import { CreateProductComponent } from '../product-management/create-product/create-product.component';
import { ProductService } from '@shared/service-proxies/product-service';
import { ReceiveOrderService } from '@shared/service-proxies/receiver-order-service';
import { CreateRevceivedOrderComponent } from './create-revceived-order/create-revceived-order.component';

@Component({
  selector: 'app-revceived-order',
  templateUrl: './revceived-order.component.html',
  styleUrls: ['./revceived-order.component.scss']
})
export class RevceivedOrderComponent extends CrudComponentBase implements OnInit {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private productService: ProductService,
    private receiveOrderService: ReceiveOrderService,
    public confirmationService: ConfirmationService,

  ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: "Trang chủ", routerLink: ["/home"] },
      { label: "Quản lý hóa đơn nhập" },
    ]);
  }

  @Input() distributionId: number;
  rows: any[] = [];

  ActiveDeactiveConst = ActiveDeactiveConst;
  PolicyTempConst = PolicyTempConst;
  PolicyDetailTemplateConst = PolicyDetailTemplateConst;
  YesNoConst = YesNoConst;
  MediaConst = MediaConst;
  ReceivedOrder = ReceivedOrder;

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

    // Xử lý ẩn hiện cột trong bảng
    this.cols = [
      { field: 'code', header: 'Code', width: '8rem' },
      { field: 'createdDateDisplay', header: 'CreatedDate', width: '12rem' },
      { field: 'receivedDateDisplay', header: 'ReceivedDate', width: '12rem' },
      { field: 'supplier', header: 'Supplier', width: '34rem'},
      { field: 'description', header: 'Description', width: '34rem'}
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
      row.createdDateDisplay = this.formatDate(row.createdDate);
      row.receivedDateDisplay = this.formatDate(row.receivedDate);
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
    const ref = this.dialogService.open(CreateRevceivedOrderComponent, {
      header: "Thêm hóa đơn nhập",
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

  edit(receiveOrder, isCreateDetail?: boolean) {
    const ref = this.dialogService.open(CreateRevceivedOrderComponent, {
      header: "Cập nhật thông tin",
      width: "1000px",
      contentStyle: { "max-height": "600px", overflow: "auto", "margin-bottom": "60px", },
      baseZIndex: 10000,
      data: {
        receiveOrderId: receiveOrder.id,
        receiveOrder: receiveOrder
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
    this.receiveOrderService.getAll(this.page, this.status).subscribe((res) => {
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
