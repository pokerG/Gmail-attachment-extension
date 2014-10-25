var state = false;
function insert_btn() {
	node = document.querySelector(".wG");
	node = node.parentNode;
	if (node != null && !state) {
		node.style.right = "200px";
		console.log(node);
		var element = document.createElement("div");
		element.setAttribute("name", "generate_btn");
		element.setAttribute("id", "test_btn");
		element.innerText = "test";
		node.appendChild(element);
		state = true;
	}else{
		console.log("!!");
	}


}
document.onmousemove = function(){
	text = document.querySelector('.Am,.aO9,.Al,.editable,.LW-avf');
	if(text != null){
		if(document.activeElement.className == text.className){
			insert_btn();
		}
	}
}



