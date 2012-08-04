oasis-stars
===========

A jQuery-based star rating system by Brian Seitel.

**Basic Usage**

```
<script src="jquery-latest.js"></script>
<script src="oasis.stars.js"></script>

<script>
  var stars = new Oasis.Stars($('#sky'), {});
</script>

<div id="sky" data-id="1"></div>
```

**Optional Parameters**

* ```onSuccess```: function to call upon successful rating (default: $.noop)
* ```onFail```: function to call upon failed rating (default: $.noop)
* ```rateURL```: path to send the rating to (default: ```rate.php```)
* ```starCount```: number of stars to create (default: 5)