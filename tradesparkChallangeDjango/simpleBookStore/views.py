from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Author, Category, Book
from .serializers import AuthorSerializer, CategorySerializer, BookSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    # Este metodo se encarga de eliminar una categoria de la lista de categorias de un libro
    # por titulo de libro y nombre de categoria...
    # No elimino a la categoria en si, solo para el libro asociado...
    @action(detail=False, methods=['get'])
    def remove_category(self, request):
        title = request.query_params.get('title')
        category_name = request.query_params.get('category')
        
        if not title or not category_name:
            return Response({'error': 'Title and category are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check exist Book
        try:
            book = Book.objects.get(title=title)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check exist category
        try:
            category = Category.objects.get(name=category_name)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        #If the book has the category I remove it
        if category in book.categories.all():
            book.categories.remove(category)
            book_serialized = BookSerializer(book)
            return Response({'message': 'Category removed successfully','book': book_serialized.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Category not associated with this book'}, status=status.HTTP_400_BAD_REQUEST)

