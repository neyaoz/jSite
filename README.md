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


#### Öntanımlı Metotlar


##### error(message) => (void)
Kullanıldığında javascript işleyişini sonlandıracak ve konsolda ilk argümanda belirttiğiniz mesaj ile hata gösterecektir.

```JS
jSite.error('undefined is not a function');
```


##### extend([deep, ]target[, obj1][, obj2][, objN]) => target
Üç kullanım amacı vardır.
* Herhangi bir objeyi üzerine yazılması suretiyle diğer objelerle birleştirmek istediğiniz durumlarda; üzerine yazılacak hedef obje ilk argümanda, birleştirilecek objeler ise diğer argümanlarda girilmelidir.
* Birden fazla objeyi birleştirmek suretiyle yeni bir obje yaratmak istediğiniz durumlarda; boş düz obje ilk argümanda, birleştirilecek objeler ise diğer argümanlarda girilmelidir.
* jSite yardımcı metotlarını genişletmek istediğiniz durumlarda, target argümanını genişletmek istediğiniz metotları içeren yalın obje ile kullanmalı ve başka argüman kullanmamalısınız. Aksi takdirde ilk kullanım amacı gerçekleşecektir.

Objeler argüman sırasıyla birleştirilir ve çok katmanlı birleştirme yapılmak istenildiğinde ilk argümanın öncesine **true** eklenebilir. Çok katmanlı birleştirme sadece ilk iki seçenekte kullanılabilir.

```JS
var obj1 = {
  foo: true
};
var obj2 = {
  bar: true
};

$.extend(obj1, obj2); // => {foo: true, bar: true}
return obj1; // => {foo: true, bar: true}
```

```JS
var obj1 = {
  foo: true
};
var obj2 = {
  bar: true
};

$.extend({}, obj1, obj2); // => {foo: true, bar: true}
return obj1 // => { foo: true }
```


##### merge(target[, obj1][, obj2][, objN]) => target
İlk dizi benzeri objenin üzerine ikinci dizi benzeri objeyi ekler ve ilk objeyi dönderir.

```JS
jSite.merge(['a', 'b', 'c'], ['x', 'y', 'z']); // => ['a', 'b', 'c', 'x', 'y', 'z']
```


##### each(obj, callback(index, value, obj)) => obj
Objedeki her özelliğe ikinci argümanda girilen geri çağırımı uygular. Geri çağırım **false** döndüğü takdirde döngü sonlandırılır.

```JS
var array = [];
jSite.each(['a', 'b', 'c']function(index, value, obj) {
  array.push(index + ':'  + value);
}); // => ['a', 'b', 'c']

return array; // => ['0:a', '1:b', '2:c']
```


##### invertKeys(obj)
Objenin anahtarları ile değerleri yer değiştirir.

```JS
var obj = {
  foo: 'bar'
}
jSite.invertKeys(obj); // => {bar: 'foo'}
```


##### parseData(obj)
Girilen objenin veri tipine uygun olarak dönülmesini sağlar. Bu metotla yalın JSON verisi de işlenilebilmektedir.

```JS
jSite.parseData('true'); // => true
jSite.parseData('null'); // => null

jSite.parseData(); // => undefined
jSite.parseData(undefined); // => undefined

jSite.parseData('32'); // => 32
jSite.parseData('32.32'); // => 32.32
jSite.parseData('1e+32'); // => 1e+32

jSite.parseData('{"foo":"bar"}'); // { foo: 'bar' }
```


##### setData(path, value)
Nokta notasyonu aracılığıyla obje oluşturulup son anahtara değer atanabilmesini sağlar.

```JS
jSite.setData("foo", true); // => { foo: true }
jSite.setData("foo.bar", true); // => { foo: { bar: true } }
```


##### getData(obj, path)
Objedeki değerlere nokta notasyonu aracılığıyla erişilebilmesine imkan sağlar.

```JS
var obj = [
  'a','b','c', {
    foo: {
      bar: true
    }
  }
];

jSite.getData(obj, "0"); // => 'a'
jSite.getData(obj, "3.foo"); // => { bar: true }
jSite.getData(obj, "3.foo.bar"); // => true
```


##### getOnly(obj, keys, except) => obj|obj[keys]
Objedeki sadece belirtilen anahtara ait değerler döndürülür. keys argümanı array ile belirtilmemişse değer tek başına döner. except argümanı **true** olarak belirtilirse, keys argümanı ile belirtilenler dışındakiler dönderilir.

```JS
var obj = {
  foo: 'x',
  bar: 'y'
}

jSite.getOnly(obj, foo); // => 'x'
jSite.getOnly(obj, foo, true); // => { bar: 'y' }

jSite.getOnly(obj, [foo]); // => { foo: 'x' }
jSite.getOnly(obj, [foo], true); // => { bar: 'y' }
```


##### camelCase(str)
Girilen dizgeyi camel case formatında dönderir.


##### type(obj)
Girilen verinin tipini döner.


##### isString(obj)
Girilen verinin string olup olmadığını kontrol eder.


##### isNumeric(obj)
Girilen verinin numerik olup olmadığını kontrol eder.


##### isObject(obj)
Girilen verinin obje olup olmadığını kontrol eder.


##### isPlainObject(obj)
Girilen verinin yalın obje olup olmadığını kontrol eder.


##### isArray(obj)
Girilen verinin dizi olup olmadığını kontrol eder.


##### inArray(obj, key)
Girilen dizinin ilgili anahtara sahip olup olmadığını kontrol eder.


##### isArrayLike(obj)
Girilen verinin dizi veya dizi benzeri obje olup olmadığını kontrol eder.


##### isElement(obj)
Girilen verinin DOM elementi olup olmadığını kontrol eder.


##### isDocument(obj)
Girilen verinin document elementi olup olmadığını kontrol eder.


##### isWindow(obj)
Girilen verinin window elementi olup olmadığını kontrol eder.


##### isFunction(obj)
Girilen verinin fonksiyon olup olmadığını kontrol eder.


##### isEmpty(obj)
Girilen verinin boş olup olmadığını kontrol eder.


##### isDefined(obj)
Girilen verinin tanımlı mı olduğunu kontrol eder.


##### isUndefined(obj)
Girilen verinin tanımsız mı olduğunu kontrol eder.


#### Yardımcı Metotları Genişletme
Yardımcı metotları jSite.extend() ile genişletebilirsiniz.

```JS
  jSite.extend({
    'log': function(obj) {
      console.log(obj)
    }
  })
```

Yaptığınız bu tanımlama ile örnek olarak oluşan **log** yardımcı metodunu dilediğiniz yerde kullanabilirsiniz.

```JS
  jSite.log('it is logged!')
```

-

### DOM Fonksiyonları
DOM fonksiyonları, jSite örneği aracılığıyla çağırılan ve girilen argümanları element kümesine uygulayıp yanıt dönen metotlardır.

```JS
jSite('body').each(function(index, element, instance) {
  console.log(jSite(this).options())
});
```

DOM elementleri farklı şekillerde kümelenebilir.

```JS
jSite(document); // => [document]
jSite(document.body); // => [<body>]
jSite(document.getElementById('foo')); // => [<bar id="foo">]
jSite(document.getElementsByTagName('bar')); // => [<bar id="foo">, <bar id="noo">]
jSite(document.querySelectorAll('bar#foo')); // => [<bar id="foo">]
jSite(document, document.head, document.body); // => [document, <head>, <body>]
jSite(document, 'head', 'body', 'bar'); // => [document, <head>, <body>, <bar>]
```


#### Öntanımlı DOM Fonksiyonları


##### each(callback(index, element, instance)) => instance
Kümedeki her elemente geri çağırımı uygular. Geri çağırım **false** döndüğü takdirde döngü sonlandırılır.

```JS
var array = [];
jSite('head', 'body', 'bar').each(function(index, value, instance) {
  array.push(index + ':'  + this.tagName);
}); // => [<head>, <body>, <bar>, <bar#foo>]

return array; // => ['0:head', '1:body', '2:bar', '3:bar']
```


##### options(only, except) => (mixed)
Kümedeki ilk elemanın option niteliklerini dönderir.

```HTML
<tag option-foo="x" option-bar="y">
```

```JS
jSite('tag').options(); // => { foo: 'y', bar: 'y' }
jSite('tag').options('foo'); // => 'x'
jSite('tag').options('foo', true); // => { bar: 'y' }

jSite('tag').options(['foo']); // => { foo: 'x' }
jSite('tag').options(['foo'], true); // => { bar: 'y' }
```


```HTML
<tag
  option-foo-bar="1"
  option-foo--bar="2"
  option-foo---bar="3"
  option-foo.bar="4"
  option-foo.baz="5"

  option-qux="6"
  option--qux="7"
></tag>
```

```JS
jSite('tag').options(); // =>
/*
  {
    'fooBar': 1,
    'foo-bar': 2,
    'foo-Bar': 3,
    'foo': {
      'bar': 4,
      'baz': 5
    },
    'qux': 6,
    'Qux': 7
  }
*/
```


#### DOM Fonksiyonlarını Genişletme
DOM fonksiyonlarını jSite.fn.extend() ile genişletebilirsiniz.

```JS
  jSite.fn.extend({
    'changeID': function(id) {
      return this.each(function(index, element, instance) {
        element.id = id;
      });
     }
  });
```

Yaptığınız bu tanımlama ile oluşan **changeID** DOM fonksiyonunu dilediğiniz element ile kullanabilirsiniz.

```JS
  jSite('bar#foo').changeID('new'); // => <bar id="new">
```

-

### DOM Modülleri
...
