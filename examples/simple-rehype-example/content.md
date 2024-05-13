# rehype-github-alerts test

> [!NOTE]  
> this is an example "note" (with two spaces after "[!NOTE]")

> [!CAUTION]
> this is an example "caution" (with NO spaces after "[!CAUTION]")

> [!NOTE]  
> this is an example "note" (with two spaces after "[!NOTE]") and a second line of content, containing a "strong" element and a link
> **foo** [top](#rehype-github-alerts-test)

> [!IMPORTANT]
> this is an example "important" (with NO spaces after "[!IMPORTANT]") and a second line of content, containing a "strong" element and a link
> **foo** [top](#rehype-github-alerts-test)

> [!WARNING]  
>> [!IMPORTANT]  
>> test for nested alerts

> **NOTE**
> test for legacy alerts

> **NOTE**
> test for legacy alerts with second line
> **foo** [top](#rehype-github-alerts-test)

>>> [!NOTE]
>>> test for nested blockquotes

> [!INVALID]
> test for invalid alert type

> [!WARNING]  
> foo **bar**

> [!TIP]
> [link](https://www.example.com)

> [!WARNING] not a valid title, renders as blockquote
> Hello World!
