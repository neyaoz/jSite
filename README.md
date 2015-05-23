jSite
=====
jSite, DOM elementleri ile javascript modülleri arasında köprü görevi gören ve otomatik initalize imkanı sağlayan bir eklentidir. Bu sayede popüler javascript kütüphaneleri ile yazılan eklentileri jSite'a entegre ettikten sonra tek satır javascript yazmadan ve her seferinde farklı opsiyonlarla dilediğiniz elemente bağlayabilirsiniz. Ayrıca içerdiği yardımcı metotlarla sık kullandığınız işlevleri gerçekleştirebilirsiniz. Gerekli olduğu durumlarda kendinize özel yardımcı metotlar tanımlayabilir ve jSite'ı genişletebilirsiniz.

---

## Özellikler

### Yardımcı Metotlar
Yardımcı metotlar, jSite objesi aracılığıyla doğrudan çağırılan ve girilen argümanları işleyip yanıt dönen metotlardır.

```JS
jSite.each(['a', 'b', 'c', ['x', 'y', 'z']], function(index, value, array) {
  if (jSite.isArray(value) {
    console.log('the value is an array!');
  } else {
    console.log('the value is: ' + value);
  }
})
```
-
#### Öntanımlı Metotlar

##### error(message)
Bu yardımcı metodu kullandığınızda javascript işleyişini sonlandıracak ve konsolda ilk argümanda belirttiğiniz mesaj ile hata gösterecektir.

##### extend([deep, ]target[, obj1][, obj2][, objN])
Bu yardımcı metodun üç kullanım amacı vardır.
* Herhangi bir objeyi üzerine yazılması suretiyle diğer objelerle birleştirmek istediğiniz durumlarda; üzerine yazılacak hedef obje ilk argümanda, birleştirilecek objeler ise diğer argümanlarda girilmelidir.
* Birden fazla objeyi birleştirmek suretiyle yeni bir obje yaratmak istediğiniz durumlarda; boş düz obje ilk argümanda, birleştirilecek objeler ise diğer argümanlarda girilmelidir.
* jSite yardımcı metotlarını genişletmek istediğiniz durumlarda, target argümanını genişletmek istediğiniz metotları içeren yalın obje ile kullanmalı ve başka argüman kullanmamalısınız. Aksi takdirde ilk kullanım amacı gerçekleşecektir.

Objeler argüman sırasıyla birleştirilir ve çok katmanlı birleştirme yapılmak istenildiğinde ilk argümanın öncesine **true** eklenebilir. Çok katmanlı birleştirme sadece ilk iki seçenekte kullanılabilir.

##### merge(alo1, alo2)

##### each(obj, callback(index, value, obj))

##### invertKeys(obj)

##### getOnly(obj, keys, except)

##### getData(obj, path)

##### parseData(obj)

##### snakeCase

##### camelCase


##### type(obj)

##### isString(obj)

##### isNumeric(obj)

##### isObject(obj)

##### isPlainObject(obj)

##### isArray(obj)

##### inArray(obj)

##### isArrayLike(obj)

##### isElement(obj)

##### isDocument(obj)

##### isWindow(obj)

##### isFunction(obj)

##### isEmpty(obj)

##### isDefined(obj)

##### isUndefined(obj)
-
#### Metotları Genişletme
Yardımcı metotları jSite.extend() ile genişletebilirsiniz.

```JS
  jSite.extend({
    'log': function(obj) {
      console.log(obj)
    }
  })
```

Yaptığınız bu tanımlama ile örnek olarak oluşturduğunuz **log** yardımcı metodunu dilediğiniz yerde kullanabilirsiniz.

```JS
  jSite.log('it is logged!')
```


### DOM Fonksiyonları
...


### DOM Modülleri
...
