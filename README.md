jSite
=====
jSite, DOM elementlerini yönetmeyi sağlayan ve onlara modüler özellikler kazandıran bir kütüphanedir. jSite size üç farklı araç sunar, bunlar:

- Yardımcı Metotlar
- DOM Fonksiyonları
- DOM Modülleri

```shell
bower install jsite
```
---


## Yardımcı Metotlar
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


#### Öntanımlı Yardımcı Metotlar
jSite'ın içerdiği öntanımlı yardımcı metotlarla sık kullandığınız işlevler kolaylıkla gerçekleştirilebilir.


##### isDefined(obj)
Veri tanımlı ise true döner.


##### isUndefined(obj)
Veri tanımsız ise true döner.


##### isNull(obj)
Veri null ise true döner.


##### isEmpty(obj)
Veri boş ("", 0, [], null, undefined) ise true döner.


##### isString(obj)
Veri bir string ise true döner.


##### isNumeric(obj)
Veri bir obje ise true döner.


##### isObject(obj)
Veri bir obje ise true döner.


##### isPlain(obj)
Veri bir plain obje ({}) ise true döner.


##### isArray(obj)
Veri bir array ise true döner.


##### inArray(obj, value)
Veri ikinci argümanda belirtilen değeri içeren bir array ise true döner.


##### isArrayLike(obj)
Veri bir array veya ArrayLike obje ise true döner.


##### isFunction(obj)
Veri bir fonksiyon ise true döner.


##### isWindow(obj)
Veri bir window elementi ise true döner.


##### isDocument(obj)
Veri bir document elementi ise true döner.


##### isElement(obj)
Veri bir DOM elementi ise true döner.


##### type(obj)
Verinin tipini döner.


##### error(message) => (void)
Belirttiğiniz mesaj ile bir Exception üretir.


##### camelCase(str)
String veriyi camelCase formatında döner.


##### each(obj, callback(index, value, obj)) => obj
Objedeki her propery için ikinci argümanda girilen callback'i çağırır. Callback **false** return ettiği takdirde döngü sonlandırılır.

```JS
var obj = ['a', 'b', 'c'];
jSite.each(obj, function(index, value, obj) {
  console.log(index + ':'  + value); // => ['0:a', '1:b', '2:c']
});
```


##### extend([deep, ]&target[, obj1][, obj2][, objN]) => target
Birden fazla obje bu metot aracılığıyla birleştirilebilir. Üç kullanım durumu vardır.

- Tüm argümanlardaki objeler birleştirilerek yeni bir obje türetilmesi için ilk argümana plain obje ({}) girilir. Böylece diğer argümanlardaki objelerin bu obje üzerinde birleşmesi sağlanır. Metot birleşim objesini return eder.

- Tüm argümanlardaki objelerin belirttiğiniz bir obje üzerinde birleşmesi için ilk argümana hedef obje girilir. Böylece diğer argümanlardaki objelerin bu obje üzerinde birleşmesi sağlanır. Hedef objenin kendisi manipüle olduğu için return değerinin alınmasına gerek yoktur.

- jSite yardımcı metotlarının genişletilmek istendiği durumlarda ise eklenecek yardımcı metot veya metotların bulunduğu plain obje tek başına ilk argümana girilir. Eğer birden fazla argüman girilirse extend metotu ilk iki durum için çalışacaktır. Detaylı bilgi için "Yardımcı Metotları Genişletme" bölümünde bulunmaktadır.

Objeler argüman sırasıyla birleştirilir. Recursive birleştirme yapılmak istenildiğinde ilk argümanın öncesine **true** eklenmelidir. Çok katmanlı birleştirme sadece ilk iki durumda kullanılabilir.

###### Örnek 1:
```JS
var obj1 = {
  foo: true
};
var obj2 = {
  bar: true
};

jSite.extend({}, obj1, obj2); // => {foo: true, bar: true}
obj1 // => { foo: true }
```

###### Örnek 2:
```JS
var obj1 = {
  foo: true
};
var obj2 = {
  bar: true
};

jSite.extend(obj1, obj2); // => {foo: true, bar: true}
obj1; // => {foo: true, bar: true}
```

###### Örnek 3:
```JS
jSite.extend({
	sum: function($a, $b) {
    	return $a + $b
    }
});

jSite.sum(2 + 2); // => {foo: true, bar: true}
```


##### merge(&target[, obj1][, obj2][, objN]) => target
Birden fazla ArrayLike obje bu metot aracılığıyla birleştirilebilir. Kullanımı, extend yardımcı metodunun ilk iki durumuyla aynıdır.

###### Örnek 1:
```JS
var obj1 = ['a', 'b', 'c'];
var obj2 = ['x', 'y', 'z'];

jSite.merge([], obj1, obj2); // => ['a', 'b', 'c', 'x', 'y', 'z']
obj1 // => ['a', 'b', 'c']
```

###### Örnek 2:
```JS
var obj1 = ['a', 'b', 'c'];
var obj2 = ['x', 'y', 'z'];

jSite.merge(obj1, obj2); // => ['a', 'b', 'c', 'x', 'y', 'z']
obj1 // => ['a', 'b', 'c', 'x', 'y', 'z']
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
String olarak girilen bir verinin, kendi veri tipinde return edilmesini sağlar. JSON verisi girildiğinde ise parse edilecek ve plain obje return edilir.

```JS
jSite.parseData(); // => undefined
jSite.parseData('undefined'); // => undefined
jSite.parseData('null'); // => null
jSite.parseData('true'); // => true

jSite.parseData('32'); // => 32
jSite.parseData('32.32'); // => 32.32
jSite.parseData('1e+32'); // => 1e+32

jSite.parseData('{"foo":"bar"}'); // { foo: 'bar' }
```


##### setData(&target, path, value)
İlk argümandaki hedef objeye ikinci argümanda belirtilen notasyonda değer atanmasını sağlar.

```JS
var obj = {}
jSite.setData(obj, "foo", true); // => { foo: true } }
jSite.setData(obj, "foo.baz", true); // => { foo: { bar: true } }
```

İlk argümana plain obje girerek belirtilen notasyonda yeni bir plain obje oluşması sağlanabilir.


##### getData(obj, path)
İlk argümandaki objeyenin ikinci argümanda belirtilen notasyondaki değerin alınmasını sağlar.

```JS
var obj = {
	foo: {
    	bar: {
        	baz: true
        }
    }
};

jSite.getData(obj, 'foo'); // => { bar: { baz: true } }
jSite.getData(obj, 'foo.bar'); // => { baz: true }
jSite.getData(obj, 'foo.bar.baz'); // => true
```


##### getOnly(obj, keys, except) => obj|obj[keys]
Objedeki sadece belirtilen değerleri döndürür. keys argümanı array ile belirtilmişse değerler bir array içinde döner. except argümanı **true** olarak belirtilirse, keys argümanı ile belirtilenler dışındakileri döner.

```JS
var obj = {
  foo: 'x',
  bar: 'y'
}

jSite.getOnly(obj, foo); // => 'x'
jSite.getOnly(obj, foo, true); // => { bar: 'y' }

jSite.getOnly(obj, [foo]); // => { foo: 'x' }
jSite.getOnly(obj, [foo], true); // => [ bar: 'y' ]
```


#### Yardımcı Metotları Genişletme
Özel yardımcı metotlar tanımlanarak kütüphane genişletilebilir. Bunun için ***jSite.extend*** yardımcı metodu kullanılır.

```JS
jSite.extend({
  'log': function(obj) {
    console.log(obj)
  }
})
```

Yaptığınız bu tanımlama ile oluşan **log** yardımcı metodunu dilediğiniz yerde kullanabilirsiniz.

```JS
jSite.log('it is logged!')
```


## DOM Fonksiyonları
DOM fonksiyonları, jSite instance'ı aracılığıyla çağırılan, girilen argümanları element kümesine uygulayıp yanıt dönen metotlardır.

```JS
jSite('body').each(function(index, element, instance) {
  console.log(this); // => <div />
});
```

DOM elementleri farklı şekillerde kümelenerek jSite instance'ı üretilebilir.

```JS
jSite( document ); // => [document]
jSite( document.body ); // => [<body>]
jSite( document.getElementById('foo') ); // => [<bar id="foo">]
jSite( document.getElementsByTagName('bar') ); // => [<bar id="foo">, <bar id="noo">]
jSite( document.querySelectorAll('bar#foo') ); // => [<bar id="foo">]
jSite([document, document.head, document.body]); // => [document, <head>, <body>]
jSite([document, 'head', 'body', 'bar']); // => [document, <head>, <body>, <bar>]
```


#### Öntanımlı DOM Fonksiyonları
jSite'ın içerdiği öntanımlı DOM fonksiyonları ile sık kullandığınız işlevler element kümelerine kolaylıkla uygulanabilir.


##### each(callback(index, element, instance)) => instance
Kümedeki her element için ikinci argümanda girilen callback'i çağırır. Callback **false** return ettiği takdirde döngü sonlandırılır.

```JS
jSite(['head', 'body', 'bar']).each(function(index, value, instance) {
  console.log(index + ':'  + this.tagName); // => ['0:head', '1:body', '2:bar', '3:bar']
});
```


##### data(only, except) => (mixed)
Kümedeki ilk elemanın j-data niteliklerini döner. Fonksiyondaki only ve except argümanlarının kullanımı, getOnly yardımcı metodundaki kullanımla aynıdır.


###### Örnek 1:
```HTML
<tag j-data-foo="x" j-data-bar="y">
```

```JS
jSite('tag').data(); // => { foo: 'y', bar: 'y' }
jSite('tag').data('foo'); // => 'x'
jSite('tag').data('foo', true); // => { bar: 'y' }

jSite('tag').data(['foo']); // => { foo: 'x' }
jSite('tag').data(['foo'], true); // => { bar: 'y' }
```


###### Örnek 2:
```HTML
<tag
  j-data-foo-bar="1"
  j-data-foo--bar="2"
  j-data-foo---bar="3"
  j-data-foo.bar="4"
  j-data-foo.baz="5"

  j-data-qux="6"
  j-data--qux="7"
></tag>
```

```JS
jSite('tag').data(); /* =>
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
Özel DOM fonksiyonları tanımlanarak kütüphane genişletilebilir. Bunun için ***jSite.fn.extend*** yardımcı metodu kullanılır.

###### Örnek 1:
```JS
jSite.fn.extend({
  'changeID': function(id) {
    return this.each(function(index, element, instance) {
      element.id = id;
    });
   }
});

jSite('foo#example').changeID('bar'); // => <foo id="bar">
```


Ayrıca DOM fonksiyonları, başka pluginleri element ile ilişkilendirmek için de kullanılabilir.

###### Örnek 2:
```JS
jSite.fn.extend({
  'autoSlider': function() {
    return this.each(function(index, element, instance) {
      var options = jSite(this).data();
      jQuery(this).slider(options);
    });
   }
});
```

Yapılan bu tanımlama ile oluşan **autoSlider*** DOM fonksiyonu kullanılarak, jQuery UI Slider plugin'inin, elementin j-data attribute'lerinde belirtilen değerler ile çalıştırılması sağlanabilir.

```HTML
  <div class="example" j-data-min="1" j-data-max="9"></div>
```

```JS
  jSite('div.example').autoSlider();
```


## DOM Modülleri
...


#### DOM Modüllerini Genişletme
Özel DOM modülleri tanımlanarak kütüphane genişletilebilir. Bunun için ***jSite.md.extend*** yardımcı metodu kullanılır.

###### Örnek 1:
```JS
jSite.md.extend({
  random: {
    data: { min: 0, max: 100 },
    onRegister: function() {},
    onBoot: function() {},

    prototype: {
      data: {},
      rand: function() {
        this.node.innerHTML =
        	Math.floor(Math.random() * (this.data.max - this.data.min)) + this.data.min
      },
      onCompile: function(node, data, module) {
        this.rand();
      },
      onDataChange: function(node, name, data) {
        this.rand();
      }
    }
  }
});
```


...


```HTML
<random j-data-min="10" j-data-max="99"></random> <!-- => 64 -->
````
veya
```HTML
<foo j-bind="random" j-data-min="10" j-data-max="99"></foo> <!-- => 58 -->
````
veya
```JS
jSite('foo#bar').md('random');
```
```HTML
<foo id="bar" j-data-min="10" j-data-max="99"></foo> <!-- => 14 -->
```