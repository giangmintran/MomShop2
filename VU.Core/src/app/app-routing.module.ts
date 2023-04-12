import { LoginUrlComponent } from './login-url/login-url.component';
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppMainComponent } from "./layout/main/app.main.component";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { PermissionCoreConst } from '@shared/AppConsts';
import { ManagementReportComponent } from './export-report/management-report/management-report.component';
import { OperationalReportComponent } from './export-report/operational-report/operational-report.component';
import { BusinessReportComponent } from './export-report/business-report/business-report.component';
import { SystemReportComponent } from './export-report/system-report/system-report.component';
import { ProductManagementComponent } from './product-management/product-management.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: AppMainComponent,
				children: [
					{ path: "login/url/:accessToken/:refreshToken", component: LoginUrlComponent},
					{ path: "home", component: HomeComponent, canActivate: [AppRouteGuard] },
					{ path: "user", component: UserComponent, canActivate: [AppRouteGuard] },
					// {
					// 	path: "app-account",
					// 	children: [
					// 		{
					// 			path: "user-account",
					// 			component: InvestorListAccountComponent,
					// 			canActivate: [AppRouteGuard],
					// 		},
					// 		{
					// 			path: "not-verified",
					// 			component: NotVerifiedComponent,
					// 			canActivate: [AppRouteGuard],
					// 		},
					// 	],
					// },
					// {
					// 	path: 'customer',
					// 	children: [
					// 		{ path: 'investor', component: InvestorComponent, data: {permissions: [PermissionCoreConst.CoreMenuKHCN]}, canActivate: [AppRouteGuard] },
					// 		{ path: 'investor/approve', component: InvestorApproveComponent, data: {permissions: [PermissionCoreConst.CoreMenuDuyetKHCN]}, canActivate: [AppRouteGuard] },
					// 		{
					// 			path: 'investor/:id/temp/:isTemp',
					// 			data: {permissions: [PermissionCoreConst.CoreDuyetKHCN_ThongTinKhachHang, PermissionCoreConst.CoreKHCN_ThongTinKhachHang]},
					// 			component: InvestorDetailComponent,
					// 			canActivate: [AppRouteGuard], 
					// 		},
					// 		{
					// 			path: 'investor/:id/temp/:isTemp/:isApprove',
					// 			data: {permissions: [PermissionCoreConst.CoreQLPD_KHCN_ThongTinChiTiet]},
					// 			component: InvestorDetailComponent,
					// 			canActivate: [AppRouteGuard], 
					// 		},
					// 	],
					// },
					// {
					// 	path: "partner-manager",
					// 	children: [
					// 		{ 
					// 			path: 'partner',
					// 			data: {permissions: [PermissionCoreConst.CoreMenu_DoiTac]}, 
					// 			component: PartnerComponent, 
					// 			canActivate: [AppRouteGuard] 
					// 		},
					// 		{
					// 			path: "partner/detail/:id",
					// 			data: {permissions: [PermissionCoreConst.CoreDoiTac_ThongTinChiTiet]}, 
					// 			component: PartnerDetailComponent,
					// 			canActivate: [AppRouteGuard],
					// 		},
					// 		{ 
					// 			path: 'trading-provider',
					// 			data: {permissions: [PermissionCoreConst.CoreMenu_DaiLy]}, 
					// 			component: TradingProviderComponent, 
					// 			canActivate: [AppRouteGuard] 
					// 		},
					// 		{
					// 			path: "trading-provider/detail/:id",
					// 			data: {permissions: [PermissionCoreConst.CoreDaiLy_ThongTinChiTiet]}, 
					// 			component: TradingProviderDetailComponent,
					// 			canActivate: [AppRouteGuard],
					// 		}
					// 	],
					// },
					// {
					// 	path: "sale-manager",
					// },
					// {
					// 	path: "approve-manager",
					// 	children: [
					// 		{ 
					// 			path: 'approve/:dataType', 
					// 			data: {permissions: [
					// 					PermissionCoreConst.CoreQLPD_KHCN_DanhSach, 
					// 					PermissionCoreConst.CoreQLPD_KHDN_DanhSach, 
					// 					PermissionCoreConst.CoreQLPD_NDTCN_DanhSach, 
					// 					PermissionCoreConst.CoreQLPD_Sale_DanhSach
					// 				]
					// 			}, 
					// 			component: ApproveComponent, 
					// 			canActivate: [AppRouteGuard] 
					// 		},
					// 		{ 
					// 			path: 'approve-email-phone/:dataType', 
					// 			data: {permissions: [
					// 					PermissionCoreConst.CoreQLPD_Email_DanhSach, 
					// 					PermissionCoreConst.CoreQLPD_Phone_DanhSach, 
					// 				]
					// 			}, 
					// 			component: ApproveEmailPhoneComponent, 
					// 			canActivate: [AppRouteGuard] 
					// 		},
					// 	],
					// },
					{
						path: "product", component: ProductManagementComponent
					},
					{
						path: "notification",
					},
					{	
						path: "collab-contract", 
						data: {permissions: [PermissionCoreConst.CoreSaleActive_HDCT]}, 
						canActivate: [AppRouteGuard]
					},
					
					{ 
						path: "export-report", 
						children: [
							{path: "management-report", component: ManagementReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_QuanTri], canActivate: [AppRouteGuard]}},
							{path: "operational-report", component: OperationalReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_VanHanh], canActivate: [AppRouteGuard]}},
							{path: "business-report", component: BusinessReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_KinhDoanh], canActivate: [AppRouteGuard]}},
							{path: "system-report", component: SystemReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_HeThong], canActivate: [AppRouteGuard]}},
							
						],
					},
				],
			},
		]),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
