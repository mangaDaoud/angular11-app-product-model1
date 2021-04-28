import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
//import "rxjs/add/operator/map";
import { catchError, map, startWith } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { AppDataState, DataStateEnum } from 'src/app/state/product.state';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  //products : Product[] |null = null; // je le mets à null et je l'affecte à null
  //products?:Product[];// products peut ne pas avoir de valeur. 
  //products$ : Observable<Product[]> |null = null;AppDataState<T>
  products$ : Observable<AppDataState<Product[]>> |null = null;
  readonly DataStateEnum  = DataStateEnum;
  constructor(private productService: ProductsService, private router: Router) {

   }

  ngOnInit(): void {
  } 
  onGetAllProducts(){
   this.products$ = this.productService.getAllProducts().pipe(
     map(data=>{
       console.log(data);
       return ({dataState:DataStateEnum.LOADED,data:data})
      }),
     startWith({dataState : DataStateEnum.LOADING}),
     catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage:err.message}))
   );
  }
  onGetSelectedProducts(){
    this.products$ = this.productService.getSelectedProducts().pipe(
      map(data=>{
        console.log(data);
        return ({dataState:DataStateEnum.LOADED,data:data})
       }),
      startWith({dataState : DataStateEnum.LOADING}),
      catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }
  onGetAvailableProducts(){
    this.products$ = this.productService.getAvailableProducts().pipe(
      map(data=>{
        console.log(data);
        return ({dataState:DataStateEnum.LOADED,data:data})
       }),
      startWith({dataState : DataStateEnum.LOADING}),
      catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }
  onSearch(dataForm : any){
    this.products$ = this.productService.searchProducts(dataForm.keyword).pipe(
      map(data=>{
        console.log(data);
        return ({dataState:DataStateEnum.LOADED,data:data})
       }),
      startWith({dataState : DataStateEnum.LOADING}),
      catchError(err=>of({dataState: DataStateEnum.ERROR, errorMessage:err.message}))
    ); 
  }
  onSelect(p: any){
    this.productService.select(p).subscribe(
      data=>{
        p.selected = data.selected;
        //this.onGetAllProducts();
      }
    )
  }
  onDelete(p: Product){
    let v  = confirm("Vous allez supprimer le produit "+p.name);
    if(v == true)
    this.productService.delete(p).subscribe(
      data=>{
        this.onGetAllProducts();
      }
    )
  }
  onNewProduct(){
    this.router.navigateByUrl("/newProduct");
    
  }
  onUpdate(p: Product){
    let v  = confirm("Vous allez modifier le produit "+p.name);
    if(v == true)
   this.router.navigateByUrl("/editProduct/"+p.id);
  }
}
