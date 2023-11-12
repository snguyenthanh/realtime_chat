"""Add indexes and user-conversation unique constraint

Revision ID: ae69526f7543
Revises: 87a24d9099b9
Create Date: 2023-11-11 07:11:02.892876

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ae69526f7543'
down_revision = '87a24d9099b9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(op.f('ix_message_user_id'), 'message', ['user_id'], unique=False)
    op.create_unique_constraint('_user_conversation_uc', 'participant', ['user_id', 'conversation_id'])
    op.create_index(op.f('ix_user_full_name'), 'user', ['full_name'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_full_name'), table_name='user')
    op.drop_constraint('_user_conversation_uc', 'participant', type_='unique')
    op.drop_index(op.f('ix_message_user_id'), table_name='message')
    # ### end Alembic commands ###