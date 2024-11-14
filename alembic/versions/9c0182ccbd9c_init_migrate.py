"""Init Migrate

Revision ID: 9c0182ccbd9c
Revises: 
Create Date: 2024-11-13 12:10:00.366530

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import fastapi_utils


# revision identifiers, used by Alembic.
revision: str = '9c0182ccbd9c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', fastapi_utils.guid_type.GUID(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_table('directories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', fastapi_utils.guid_type.GUID(), nullable=False),
    sa.Column('dir_name', sa.String(), nullable=False),
    sa.Column('dir_path', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id', 'dir_name', name='uq_user_dirname')
    )
    op.create_index(op.f('ix_directories_dir_name'), 'directories', ['dir_name'], unique=True)
    op.create_index(op.f('ix_directories_dir_path'), 'directories', ['dir_path'], unique=True)
    op.create_table('friends',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', fastapi_utils.guid_type.GUID(), nullable=False),
    sa.Column('friend_id', fastapi_utils.guid_type.GUID(), nullable=False),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('friends')
    op.drop_index(op.f('ix_directories_dir_path'), table_name='directories')
    op.drop_index(op.f('ix_directories_dir_name'), table_name='directories')
    op.drop_table('directories')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    # ### end Alembic commands ###